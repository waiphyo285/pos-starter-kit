const async = require('async')
const serialize = require('../serializer2')

const User = require('@models/mongodb/schemas/user')
const UserLog = require('@models/mongodb/schemas/user-log')
const Account = require('@models/mongodb/schemas/account')
const Owner = require('@models/mongodb/schemas/owner')
const Employee = require('@models/mongodb/schemas/employee')

const utils = require('@utils/index')
const { checkReference } = require('@utils/schema')
const { services, constant } = require('@config/constant')

const service = services.user

const controller = (module.exports = {})

const popAndSerializeUsers = (query, service) =>
    query
        .populate({
            path: 'level_id',
            model: 'user_role',
            select: 'level',
        })
        .lean()
        .then((data) => serialize(data, service, true))

controller.listUsers = async (params) => {
    const filter = {}

    if (params.created_at) {
        filter['created_at'] = await utils.getDateRange(params.created_at)
    }

    if (!params.n_filter) {
        return popAndSerializeUsers(User.find(filter), service)
    }

    if (params.n_filter['account_type'] === constant.owner) {
        const ownerId = params.n_filter['owner_id']
        const accountQry = Account.find({ owner_id: ownerId }, '-_id user_id')

        return accountQry.then((acc) => {
            const userQry = User.find({
                ...filter,
                _id: { $in: acc.map((a) => a.user_id) },
                user_type: { $ne: constant.owner },
            })
            return popAndSerializeUsers(userQry, service)
        })
    }

    return []
}

controller.findUserById = (id) => {
    return User.findById(id)
        .lean()
        .then((data) => serialize(data, service))
}

controller.findUserLog = (params) => {
    return UserLog.find(params)
        .sort({ created_at: -1 })
        .limit(8)
        .lean()
        .then((data) => serialize(data, service))
}

controller.addUser = async (dataObj) => {
    let accObj = {}

    let { account, ...userObj } = dataObj

    if (account.account_type) {
        accObj = account

        userObj = {
            ...userObj,
            user_type: account.account_type,
        }
    }

    const user = new User(userObj)
    const userRes = await user.save()

    if (accObj.account_type) {
        const newAccObj = {
            ...account,
            user_id: userRes._id,
        }

        const accountRes = await Account.create(newAccObj)

        if (accountRes.account_type == constant.employee) {
            await Employee.findOneAndUpdate({ _id: accountRes.staff_id }, { account_id: accountRes._id })

            await User.findOneAndUpdate({ _id: userRes._id }, { account_id: accountRes._id })
        }
    }

    return serialize(userRes, service)
}

controller.createUser = (dataObj) => {
    let accObj = {}
    let userObj = {}

    let filter = {
        user_id: dataObj.id,
        account_type: dataObj.account_type,
    }

    switch (dataObj.account_type) {
        case constant.owner:
            accObj = {
                user_id: dataObj.id,
                owner_id: dataObj.owner_id,
                account_type: dataObj.account_type,
            }
            break

        case constant.employee:
            accObj = {
                user_id: dataObj.id,
                owner_id: dataObj.owner_id,
                store_id: dataObj.store_id,
                staff_id: dataObj.staff_id,
                account_type: dataObj.account_type,
            }
            break

        default:
            break
    }

    if (utils.isEmptyObject(accObj)) {
        throw new Error('Object not found')
    }

    const updateLinkedModel = (dataObj) => {
        switch (dataObj.account_type) {
            case constant.owner:
                return Owner.findOneAndUpdate({ _id: accObj.owner_id }, { account_id: userObj.account_id })
                    .lean()
                    .then((data) => serialize(data, service))

            case constant.employee:
                return Employee.findOneAndUpdate({ _id: accObj.staff_id }, { account_id: userObj.account_id })
                    .lean()
                    .then((data) => serialize(data, service))

            default:
                break
        }
    }

    return Account.findOneAndUpdate(filter, accObj, {
        new: true,
        upsert: true,
    })
        .then((res) => {
            userObj = {
                account_id: res._id,
                user_type: res.account_type,
            }
            return User.findOneAndUpdate({ _id: res.user_id }, userObj).lean()
        })
        .then((res) => {
            return updateLinkedModel(dataObj)
        })
        .then((data) => serialize(data, service))
}

controller.removeUser = (dataObj) => {
    const filter = {
        _id: dataObj.id,
        account_id: dataObj.account_id,
        user_type: dataObj.user_type,
    }

    const updateLinkedModel = (dataObj) => {
        switch (dataObj.user_type) {
            case constant.owner:
                return Owner.findOneAndUpdate({ account_id: dataObj.account_id }, { account_id: null }, { new: true })

            case constant.employee:
                return Employee.findOneAndUpdate(
                    { account_id: dataObj.account_id },
                    { account_id: null },
                    { new: true }
                )
            default:
                break
        }
    }

    return User.findOneAndUpdate(filter, { account_id: null }, { new: true })
        .then((res) => {
            return updateLinkedModel(dataObj)
        })
        .then((data) => serialize(data, service))
}

controller.updateWithPass = (id, dataObj) => {
    return User.findOneAndUpdate({ _id: id }, dataObj, { new: true })
        .lean()
        .then((data) => serialize(data, service))
}

controller.updateWithoutPass = async (id, dataObj) => {
    return User.findByIdAndUpdate(id, dataObj, { new: true })
        .lean()
        .then((data) => serialize(data, service))
}

controller.deleteUser = async (id) => {
    const results = await async.parallel(
        await checkReference([
            {
                name: 'account',
                key: 'user_id',
                value: id,
            },
        ])
    )

    if (results && results.reduce((acc, current) => acc + current, 0) > 0)
        return new Promise((resolve) => {
            resolve({ http_code: 405 })
        })

    return User.deleteById(id)
        .lean()
        .then((data) => serialize(data, service)) // softdelete

    // return User.findByIdAndDelete(id)
    //     .lean()
    //     .then((data) => serialize(data, service))
}
