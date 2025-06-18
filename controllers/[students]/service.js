const serialize = require('../serializer')
const Student = require('@models/mongodb/schemas/student')

const { getServerSideQuery } = require('@utils/schema')
const { getPaginationQuery } = require('@utils/schema')

const listData = async (params) => {
    const { filter, w_regx, sort, skip, limit, draw } = await getServerSideQuery(params)

    const recordsTotal = await Student.countDocuments(filter)

    return Student.find(filter)
        .or({ $or: w_regx })
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .then((data) => {
            return serialize({
                data,
                draw,
                recordsTotal,
                recordsFiltered: recordsTotal,
            })
        })
}

const findDataById = (id) => {
    return Student.findById(id).then(serialize)
}

const findDataBy = async (params) => {
    const { filter } = await getPaginationQuery(params)
    return Student.find(filter).then(serialize)
}

const addData = (dataObj) => {
    return Student.create(dataObj).then(serialize)
}

const updateData = (id, dataObj) => {
    return Student.findByIdAndUpdate(id, dataObj).then(serialize)
}

const deleteData = (id) => {
    // return Student.findByIdAndDelete(id).then(serialize)
    return Student.deleteById(id).then(serialize) // softdelete
}

const dropAll = () => {
    return new Promise((resolve) => {
        resolve({ http_code: 405 })
    })
}

module.exports = {
    listData,
    findDataById,
    findDataBy,
    addData,
    updateData,
    deleteData,
    dropAll,
}
