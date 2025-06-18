const WebSocket = require('ws')
const config = require('@config/env')

module.exports = new WebSocket(`ws://${config.WS_HOST}:${config.WS_PORT}/start`)
