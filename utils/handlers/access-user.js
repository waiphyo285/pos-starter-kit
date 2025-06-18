const path = require('path')
const UserRole = require('@controllers/user-roles')

const getMenuPath = (locale) => {
    const menuConfig = {
        en_US: `../../config/program/menu-en.json`,
        my_MM: `../../config/program/menu-my.json`,
        th_TH: `../../config/program/menu-th.json`,
    }

    return menuConfig[locale || 'en_US']
}

const getProgram = async (user, pageId) => {
    const userRole = user.role
    const userLocales = user.locale
    const splitPageId = pageId.split('.')

    const programMenu = path.resolve(__dirname, getMenuPath(userLocales))
    const initProgram = JSON.parse(JSON.stringify(require(programMenu)))

    // developer account
    if (userRole === 'developer') {
        // const menus = []

        const developerProgram = initProgram.map((initMenu) => {
            // const submenus = []

            initMenu.access = true
            initMenu.active = initMenu.menuid == splitPageId[0] && true
            initMenu.submenu = initMenu.submenu.map((initSubMenu) => {
                initSubMenu.read = true
                initSubMenu.edit = true
                initSubMenu.delete = true
                initSubMenu.access = true
                initSubMenu.active = initSubMenu.menuid == splitPageId[1] && true

                // submenus.push(initSubMenu.menuid)

                if (initSubMenu?.menuid === 'sale_invoice') {
                    initSubMenu.read = false
                    initSubMenu.delete = false
                }

                if (initSubMenu?.menuid === 'sale_refund') {
                    initSubMenu.read = false
                    initSubMenu.delete = false
                }

                if (initSubMenu?.menuid === 'payable') {
                    initSubMenu.read = false
                    initSubMenu.delete = false
                }

                if (initSubMenu?.menuid === 'receivable') {
                    initSubMenu.read = false
                    initSubMenu.delete = false
                }

                if (initSubMenu?.menuid === 'ledger_daily') {
                    initSubMenu.read = false
                    initSubMenu.delete = false
                }

                return initSubMenu
            })

            // menus.push({ [initMenu.menuid]: submenus })

            return initMenu
        })

        return {
            program: developerProgram,
            page: getPageData(developerProgram, pageId),
        }
    } else {
        const data = await UserRole.findDataById(user.level_id)
        const userProgram = data.data.program

        const curUserProgram = initProgram.map((initMenu) => {
            let subMenuMap

            const findMenu = userProgram.find((userMenu) => userMenu.menuid == initMenu.menuid)

            if (findMenu) {
                findMenu.active = findMenu.menuid == splitPageId[0] && true

                subMenuMap = initMenu.submenu.map((initSubMenu) => {
                    const findSubMenu =
                        findMenu.submenu.find((userSubMenu) => userSubMenu.menuid == initSubMenu.menuid) || {}

                    findSubMenu.active = findSubMenu.menuid == splitPageId[1] && true
                    return { ...initSubMenu, ...findSubMenu }
                })
            }
            return {
                ...initMenu,
                ...findMenu,
                submenu: subMenuMap,
            }
        })

        return {
            program: curUserProgram,
            page: getPageData(curUserProgram, pageId),
        }
    }
}

const getPageData = (getProgramMenu, getPageId) => {
    if (getPageId !== undefined) {
        let pageSubMenu = {}

        const splitPageId = getPageId.split('.')

        const pageMenuObj = getProgramMenu.find((menu) => menu.menuid == splitPageId[0])

        if (pageMenuObj) {
            pageSubMenu = pageMenuObj.submenu.find((submenu) => submenu.menuid == splitPageId[1])
        }

        return { ...pageSubMenu, active: true }
    }
    return {}
}

module.exports = { getProgram }
