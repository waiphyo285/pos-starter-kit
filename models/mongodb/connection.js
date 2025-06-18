const mongoose = require('mongoose')
const { MongoMemoryServer } = require('mongodb-memory-server')

const config = require('@config/env')
const clr = require('@config/logcolor')

// Use ES6 Promises for mongoose
mongoose.Promise = global.Promise
mongoose.set('useUnifiedTopology', true)
mongoose.set('useFindAndModify', false)
mongoose.set('useNewUrlParser', true)
mongoose.set('useCreateIndex', true)

// Set environment variables
const env = config.NODE_ENV || 'development'
const host = config.MONGO.HOST || 'localhost'
const port = config.MONGO.PORT || 27017
const user = config.MONGO.USER || 'root'
const pass = config.MONGO.PASS || 'no-pass'
const dbName = config.ETAVIRP.DATABASE || 'no_db'

const connectUrl = {
    development: `mongodb://${user}:${pass}@${host}:${port}/${dbName}?authSource=admin`,
    // production: `mongodb://${user}:${pass}@${host}:${port}/${dbName}?authSource=admin`,
    // production: `mongodb://${user}:${pass}@${host}:${port}/${dbName}?directConnection=true&serverSelectionTimeoutMS=2000&authSource=${dbName}&appName=mongosh+2.1.1`,
}

const checkTesting = async () => {
    if (env === 'testing') {
        const memoryServer = await MongoMemoryServer.create({
            instance: {
                dbName: dbName,
            },
        })
        connectUrl = {
            ...connectUrl,
            [env]: memoryServer.getUri(),
        }
    }
}

// Create connection
const dbConnect = async (checkTestingFn) => {
    await checkTestingFn()
    await mongoose.connect(connectUrl[env])
}

// Remove connection
const dbDisconnect = async () => {
    await mongoose.connection.dropDatabase()
    await mongoose.connection.close()
    await mongoServer.stop()
}

// Init connection
dbConnect(checkTesting)

// Signal connection
mongoose.connection
    .once('open', function () {
        console.info(`${clr.fg.magenta}Database: 😃 MongoDB (${env}) is connected!`)
    })
    .on('error', function (err) {
        console.error(`${clr.fg.red}Database: 😡 MongoDB connection error`, err)
    })
    .on('disconnected', function () {
        console.warn(`${clr.fg.yellow} Database: 😡 MongoDB is disconnected`)
    })

module.exports = { mongoose, dbConnect, dbDisconnect }
