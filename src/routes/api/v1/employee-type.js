const utils = require('@utils/index')
const EmployeeType = require('@controllers/employee-types')
const { handleDatabase } = require('@utils/handlers/response')

const staffType = (module.exports = {})

staffType.index = (req, res, next) => {
    const getService = EmployeeType.listData(req.query)
    handleDatabase(getService, utils.isEmptyObject, res)
}

staffType.show = (req, res, next) => {
    const getService = EmployeeType.findDataById(req.params.id)
    handleDatabase(getService, utils.isEmptyObject, res)
}

staffType.showBy = (req, res, next) => {
    const getService = EmployeeType.findDataBy(req.query)
    handleDatabase(getService, utils.isEmptyObject, res)
}

staffType.create = (req, res, next) => {
    const getService = EmployeeType.addData(req.body)
    handleDatabase(getService, utils.isEmptyObject, res)
}

staffType.update = (req, res, next) => {
    const getService = EmployeeType.updateData(req.params.id, req.body)
    handleDatabase(getService, utils.isEmptyObject, res)
}

staffType.delete = (req, res, next) => {
    const getService = EmployeeType.deleteData(req.params.id)
    handleDatabase(getService, utils.isEmptyObject, res)
}

staffType.deleteAll = (req, res, next) => {
    EmployeeType.dropAll()
        .then((data) => res.send(data))
        .catch(next)
}
