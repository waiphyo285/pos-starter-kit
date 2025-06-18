const Sequelize = require('sequelize')
const config = require('@config/env')
const clr = require('@config/logcolor')

// Set environment variables
const env = config.NODE_ENV || 'development'
const host = config.MYSQL.HOST || 'localhost'
const port = config.MYSQL.PORT || 3306
const user = config.MYSQL.USER || 'root'
const pass = config.MYSQL.PASS || 'root'
const dbName = config.ETAVIRP.DATABASE || 'no_db'

const dialect = config.MYSQL.DIALECT
const pool_min = config.MYSQL.POOL_MIN
const pool_max = config.MYSQL.POOL_MAX
const pool_idl = config.MYSQL.POOL_IDL
const pool_acq = config.MYSQL.POOL_ACQ

const database = (module.exports = {})

const instance = new Sequelize(dbName, user, '', {
    host: host,
    port: port,
    user: user,
    password: pass,
    dialect: dialect,
    operatorsAliases: 0,
    pool: {
        min: Number(pool_min),
        max: Number(pool_max),
        idle: Number(pool_idl),
        acquire: Number(pool_acq),
    },
    logging: console.log(''),
})

database.Sequelize = Sequelize
database.sequelize = instance

database.teachers = require('./schemas/teacher')(instance, Sequelize)

database.sequelize
    .sync()
    .then(() => {
        console.info(`${clr.fg.magenta}Database: 😃 MySQL (${env}) is connected!`)
    })
    .catch((err) => console.error(`${clr.fg.red}Database: 😡 MySQL connection error`, err))
