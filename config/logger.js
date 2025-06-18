const logger = require('morgan')
const config = require('@config/env')

const NODE_ENV = config.NODE_ENV

const morganOption = (tokens, req, res) => {
    return {
        development: [
            tokens.date(req, res, 'iso'),
            tokens.method(req, res),
            tokens.url(req, res),
            tokens.status(req, res),
            tokens.res(req, res, 'content-length'),
            tokens['response-time'](req, res),
        ].join(' '),
        production: [
            tokens.date(req, res, 'iso'),
            tokens.method(req, res),
            tokens.url(req, res),
            tokens.status(req, res),
            tokens.res(req, res, 'content-length'),
            tokens['response-time'](req, res),
        ].join(' '),
        // production: "", // no log if not require,
    }
}

const morganLogger = logger((tokens, req, res) => {
    return morganOption(tokens, req, res)[NODE_ENV]
})

module.exports = { morganLogger }
