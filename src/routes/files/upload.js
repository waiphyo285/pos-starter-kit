const fs = require('fs')
const path = require('path')
const multer = require('multer')
const helpers = require('./helpers')
const config = require('@config/env')
const { createResponse } = require('@utils/handlers/response')

const upload = (module.exports = {})

const UPLOAD_OK = 'File is successfully uploaded.'
const SELECT_IMG = 'Please select an image to upload.'

function sendErrorResponse(statusCode, errorMessage, locales, res) {
    const response = createResponse(statusCode, { data: { message: errorMessage } }, locales)
    return res.status(statusCode).json(response)
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const saveDir = req.params.folderName || 'data'
        const ifExistDir = './public/uploads/' + saveDir

        if (!fs.existsSync(ifExistDir)) {
            fs.mkdirSync(ifExistDir, {
                recursive: true,
            })
        }

        cb(null, ifExistDir)
    },

    // By default, multer removes file extensions so const's add them back
    filename: function (req, file, cb) {
        const prefix = config.APP.FILE + '-' + Date.now()
        const filename = prefix + path.extname(file.originalname)
        console.info(`File ${filename} is uploaded`)
        cb(null, filename)
    },
})

upload.index = (req, res, next) => {
    const locales = res.locals.i18n.translations

    // 'uploaded_file' is the name of our file input field in the HTML form
    const uploadWithMulter = multer({
        storage: storage,
        fileFilter: helpers.imageFilter,
    }).single('uploaded_file')

    uploadWithMulter(req, res, function (err) {
        // req.file contains information of uploaded file
        // req.body contains information of text fields, if there were any

        if (req.fileValidationError) {
            return sendErrorResponse(400, req.fileValidationError, locales, res)
        }

        if (!req.file) {
            return sendErrorResponse(400, SELECT_IMG, locales, res)
        }

        if (err instanceof multer.MulterError || err) {
            return sendErrorResponse(400, err, locales, res)
        }

        const data = {
            data: req.file,
            message: UPLOAD_OK,
        }

        res.status(200).json(createResponse(200, { data }, locales))
    })
}

upload.multiUpload = (req, res, next) => {
    const locales = res.locals.i18n.translations

    // 10 is the limit I've defined for number of uploaded files at once
    // 'uploaded_files' is the name of our file input field
    const uploadWithMulter = multer({
        storage: storage,
        fileFilter: helpers.imageFilter,
    }).array('uploaded_files', 10)

    uploadWithMulter(req, res, function (err) {
        if (req.fileValidationError) {
            return sendErrorResponse(400, req.fileValidationError, locales, res)
        }

        if (!req.files) {
            return sendErrorResponse(400, SELECT_IMG, locales, res)
        }

        if (err instanceof multer.MulterError || err) {
            return sendErrorResponse(400, err, locales, res)
        }

        const data = {
            data: req.files,
            message: UPLOAD_OK,
        }

        // Display uploaded image for user validation
        res.status(200).json(createResponse(200, { data }, locales))
    })
}
