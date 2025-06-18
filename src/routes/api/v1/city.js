const utils = require('@utils/index')
const City = require('@controllers/cities')
const { handleDatabase } = require('@utils/handlers/response')

const city = (module.exports = {})

city.index = (req, res, next) => {
    const getService = City.listData(req.query)
    handleDatabase(getService, utils.isEmptyObject, res)
}

city.show = (req, res, next) => {
    const getService = City.findDataById(req.params.id)
    handleDatabase(getService, utils.isEmptyObject, res)
}

city.showBy = (req, res, next) => {
    const getService = City.findDataBy(req.query)
    handleDatabase(getService, utils.isEmptyObject, res)
}

city.create = (req, res, next) => {
    const getService = City.addData(req.body)
    handleDatabase(getService, utils.isEmptyObject, res)
}

city.update = (req, res, next) => {
    const getService = City.updateData(req.params.id, req.body)
    handleDatabase(getService, utils.isEmptyObject, res)
}

city.delete = (req, res, next) => {
    const getService = City.deleteData(req.params.id)
    handleDatabase(getService, utils.isEmptyObject, res)
}

city.deleteAll = (req, res, next) => {
    City.dropAll()
        .then((data) => res.send(data))
        .catch(next)
}
