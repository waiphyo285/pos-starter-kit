const fs = require('fs')
const fsx = require('fs-extra')
const express = require('express')
const router = express.Router()
const beautify = require('js-beautify').js
const utils = require('@utils/index')
const clr = require('@config/logcolor')

const newTemplate = (req, res, next) => {
    const bodyData = JSON.parse(req.body.modal_data)
    const template = req.body.modal_name || 'test'
    const renderPage = req.body.is_page || false
    const propData = bodyData.data || {}
    const menuData = bodyData.menu || {}

    const templateString = template.split('_').join(' ')
    const templateTitle = utils.toTitleCase(template, '_', '')
    const templateCamel = utils.toCamelCase(templateString)
    const templateCamels = utils.toPluralize(templateCamel)
    const templateNames = utils.toPluralize(template)

    const checkData = !Object.keys(propData).length || (renderPage && !Object.keys(menuData).length)

    if (checkData) {
        return res.send({
            status: '400',
            data: 'Need model properties.',
        })
    }

    const configPath = {
        model: [`./generator/model.js`, `./models/mongodb/schemas/${template}.js`],
        controller: [
            `./generator/controller`,
            `./controllers/${templateNames}`,
            `./controllers/${templateNames}/index.js`,
        ],
        api: [`./generator/api.js`, `./src/routes/api/v1/${template}.js`],
        page: [`./generator/page.js`, `./src/routes/pages/${template}.js`],
        route: [`./generator/route.js`, `./src/routes/api/v1/index.js`],
    }

    copyFile({
        origPath: configPath.model[0],
        destFile: configPath.model[1],
        regexStr: /Schema\(\)|generator/gi,
        mapObj: {
            'Schema()': `Schema(${JSON.stringify({
                ...propData,
                created_at: { type: 'Date' },
                updated_at: { type: 'Date' },
            })})`,
            generator: template,
        },
    })

    copyFolder({
        origPath: configPath.controller[0],
        destPath: configPath.controller[1],
        destFile: configPath.controller[2],
        regexStr: /\b(Model|generator)\b/gi,
        mapObj: {
            Model: templateTitle,
            generator: template,
        },
    })

    copyFile({
        origPath: configPath.api[0],
        destFile: configPath.api[1],
        regexStr: /modExport|Services|generators/gi,
        mapObj: {
            Services: templateTitle,
            modExport: templateCamel,
            generators: templateNames,
        },
    })

    replaceFile({
        origPath: configPath.route[0],
        destFile: configPath.route[1],
        regexStr: /generator|routing|routings|routes/gi,
        mapObj: {
            generator: template,
            routes: templateCamels,
            routing: template,
            routings: templateNames,
        },
    })

    if (renderPage) {
        copyFile({
            origPath: configPath.page[0],
            destFile: configPath.page[1],
            regexStr: /routing|routings|runnerPage|Services|generators|menuList|menuEntry/gi,
            mapObj: {
                routing: template,
                routings: templateNames,
                Services: templateTitle,
                generators: templateNames,
                runnerPage: template.split('_').join('-'),
                menuList: menuData.list,
                menuEntry: menuData.entry,
            },
        })
    }

    res.send({
        status: '200',
        data: 'A new template is generated.',
    })
}

const copyFile = (params) => {
    const { origPath, destFile } = params
    fs.copyFile(origPath, destFile, (err) => {
        if (err) throw err
        console.info(`${clr.fg.cyan}OUT: 📝 ${origPath} is copied`)
        console.info(`${clr.fg.cyan}OUT: 📝 ${destFile} is pasted`)
        readFile(params)
    })
}

const copyFolder = (params) => {
    const { origPath, destPath } = params
    fsx.copy(origPath, destPath, (err) => {
        if (err) throw err
        console.info(`${clr.fg.cyan}OUT: 📝 ${origPath} is copied`)
        console.info(`${clr.fg.cyan}OUT: 📝 ${destPath} is pasted`)
        readFile(params)
    })
}

const readFile = (params) => {
    const { destFile, regexStr, mapObj } = params
    fs.readFile(destFile, 'utf8', (err, data) => {
        if (err) throw err
        console.info(`${clr.fg.cyan}OUT: 📝 ${destFile} is read`)
        const content = data.replace(regexStr, (matched) => mapObj[matched])
        writeFile({ destFile, content })
    })
}

const writeFile = ({ destFile, content }) => {
    fs.writeFile(destFile, beautify(content, { indent_size: 2, space_in_empty_paren: true }), (err) => {
        if (err) throw err
        console.info(`${clr.fg.cyan}OUT: 📝 ${destFile} is saved`)
    })
}

const replaceFile = (params) => {
    const { origPath, destFile, regexStr, mapObj } = params
    fs.readFile(origPath, 'utf8', (err, data) => {
        if (err) throw err
        console.info(`${clr.fg.cyan}OUT: 📝 ${origPath} is read`)
        const content = data.replace(regexStr, (matched) => mapObj[matched])
        appendFile({ destFile, content })
    })
}

const appendFile = ({ destFile, content }) => {
    fs.appendFile(
        destFile,
        beautify(content, {
            indent_size: 2,
            space_in_empty_paren: true,
        }),
        (err) => {
            if (err) throw err
            console.info(`${clr.fg.cyan}OUT: 📝 ${destFile} is appended`)
        }
    )
}

router.post('/dmar/quick-setup', newTemplate)

module.exports = router
