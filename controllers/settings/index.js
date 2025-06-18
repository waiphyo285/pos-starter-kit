const serialize = require('../serializer2')

const User = require('@models/mongodb/schemas/user')
const Owner = require('@models/mongodb/schemas/owner')
const Account = require('@models/mongodb/schemas/account')
const Setting = require('@models/mongodb/schemas/setting')
const StoreSetting = require('@models/mongodb/schemas/store-setting')

const { getServerSideQuery } = require('@utils/schema')
const { getPaginationQuery } = require('@utils/schema')
const { services } = require('@config/constant')

const service = services.setting

const controller = (module.exports = {})

controller.listData = async (params) => {
    const { filter, w_regx, sort, skip, limit, draw } = await getServerSideQuery(params)

    const recordsTotal = await Setting.countDocuments(filter)

    return Setting.find(filter)
        .or({
            $or: w_regx,
        })
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean()
        .then((data) => {
            return serialize(
                {
                    data,
                    draw,
                    recordsTotal,
                    recordsFiltered: recordsTotal,
                },
                service,
                true
            )
        })
}

controller.findDataById = (id) => {
    return Setting.findById(id).lean().then(serialize)
}

controller.findDataBy = async (params) => {
    const { filter } = await getPaginationQuery(params)
    return Setting.find(filter).lean().then(serialize)
}

controller.addData = (dataObj) => {
    return Setting.create(dataObj).then(serialize)
}

controller.updateData = (id, dataObj) => {
    let result = {}
    return Setting.findByIdAndUpdate(id, dataObj, { new: true })
        .lean()
        .then((res) => {
            result = res
            return Owner.findById(res.owner_id)
        })
        .then((ownerRes) => {
            return Account.findById(ownerRes.account_id)
        })
        .then((accountRes) => {
            const userId = accountRes.user_id
            return User.findByIdAndUpdate(userId, {
                theme: result.theme,
                locale: result.locale,
            })
        })
        .then((userRes) => {
            return StoreSetting.updateMany(
                { owner_id: result.owner_id },
                {
                    currency: result.currency,
                    rounding: result.rounding,
                    timezone: result.timezone,
                }
            )
        })
        .then((storeSettingRes) => {
            return result
        })
        .then(serialize)
}

controller.deleteData = async (id) => {
    // return Setting.findByIdAndDelete(id).lean().then(serialize)
    return Setting.deleteById(id).then(serialize) // softdelete
}

controller.dropAll = () => {
    return new Promise((resolve) => {
        resolve({ http_code: 405 })
    })
}
