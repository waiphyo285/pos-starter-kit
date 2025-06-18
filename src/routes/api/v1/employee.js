const utils = require('@utils/index')
const Employee = require('@controllers/employees')
const { handleDatabase } = require('@utils/handlers/response')

const staff = (module.exports = {})

staff.index = (req, res, next) => {
    const getService = Employee.listData(req.query)
    handleDatabase(getService, utils.isEmptyObject, res)
}

staff.show = (req, res, next) => {
    const getService = Employee.findDataById(req.params.id)
    handleDatabase(getService, utils.isEmptyObject, res)
}

staff.showBy = (req, res, next) => {
    const getService = Employee.findDataBy(req.query)
    handleDatabase(getService, utils.isEmptyObject, res)
}

staff.create = (req, res, next) => {
    const getService = Employee.addData(req.body)
    handleDatabase(getService, utils.isEmptyObject, res)
}

staff.update = (req, res, next) => {
    const getService = Employee.updateData(req.params.id, req.body)
    handleDatabase(getService, utils.isEmptyObject, res)
}

staff.delete = (req, res, next) => {
    const getService = Employee.deleteData(req.params.id)
    handleDatabase(getService, utils.isEmptyObject, res)
}

staff.deleteAll = (req, res, next) => {
    Employee.dropAll()
        .then((data) => res.send(data))
        .catch(next)
}
