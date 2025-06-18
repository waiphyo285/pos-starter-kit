const express = require('express')
const router = express.Router()
const { doubleCsrf } = require('csrf-csrf')
const config = require('@config/env')
const { csrfCookieOption } = require('@config/cookies')
const { createResponse } = require('@utils/handlers/response')

// get environment variables
const NODE_ENV = config.NODE_ENV
const CSRF_COOKIE = config.ETAVIRP.CSRF_COOKIE
const CSRF_SECRET = config.ETAVIRP.CSRF_SECRET

const { generateToken, doubleCsrfProtection } = doubleCsrf({
    size: 64,
    secret: CSRF_SECRET,
    cookieName: CSRF_COOKIE,
    cookieOptions: csrfCookieOption[NODE_ENV],
    ignoredMethods: ['GET', 'HEAD', 'OPTIONS'],
    getSecret: (req) => req.session.secret,
})

// Generate Token Routes
router.get('/u-csrf', (req, res) => {
    return res
        .status(200)
        .json(createResponse(200, { data: { token: generateToken(res, req) } }, res.locals.i18n.translations))
})

module.exports = {
    csrfRouter: router,
    generateCsrf: generateToken,
    csrfProtection: doubleCsrfProtection,
}
