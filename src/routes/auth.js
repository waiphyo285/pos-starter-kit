const express = require('express')
const router = express.Router()
const passport = require('passport')

const User = require('@models/mongodb/schemas/user')
const Account = require('@models/mongodb/schemas/account')
const UserLog = require('@models/mongodb/schemas/user-log')
const StoreSetting = require('@models/mongodb/schemas/store-setting')
const SubscriptionOwner = require('@models/mongodb/schemas/subscription-owner')

const { signToken_1 } = require('@middleware/token/jwt-token')
const { generateCsrf } = require('@middleware/token/csrf-token')

const config = require('@config/env')
const utils = require('@utils/index')
const sUtils = require('@utils/subscription')
const { constant } = require('@config/constant')

const OWN = constant.owner
const EMP = constant.employee
const DVL = constant.developer

const SIGNIN_ERR = 'Sorry, incorrect access was found'
const SIGNUP_ERR = 'Username or phone is already existed'

const handleInvalid = (req, res, message) => {
    req.logout()
    res.redirect(`/login?message=${encodeURIComponent(message)}`)
}

const handleLogInfo = async (logInfo, req) => {
    const userLog = new UserLog({
        status: !!logInfo,
        user_id: logInfo._id,
        ip_address: req.ip,
        user_agent: req.headers['user-agent'],
    })

    await userLog.save()
}

const handleLogin = async (userInfo, req, res, next) => {
    try {
        let msg
        const { user, account_type } = userInfo

        if (account_type !== user.user_type) {
            msg = 'Not the same account type, please sign in again.'
            handleInvalid(req, res, msg)
            return
        }

        if (account_type !== DVL && !user.account_id) {
            msg = 'No account ID was linked, please contact us.'
            handleInvalid(req, res, msg)
            return
        }

        if (account_type === OWN || account_type === EMP) {
            const ownerId = user.account_id.owner_id

            const subscriptionPlan = await SubscriptionOwner.findOne({
                owner_id: ownerId,
            })

            const checkSubscription = sUtils.validateSubscription(subscriptionPlan)

            if (!checkSubscription) {
                msg = 'Subscription is expired, please contact us to renewal.'
                handleInvalid(req, res, msg)
                return
            }

            if (account_type === EMP) {
                const filters = { owner_id: ownerId, account_type: OWN }

                const ownerOfEmp = await Account.findOne(filters).populate('user_id')

                if (!(ownerOfEmp.user_id && ownerOfEmp.user_id.account_id)) {
                    msg = 'No owner account ID was linked, please contact us.'
                    handleInvalid(req, res, msg)
                    return
                }

                const storeId = user.account_id.store_id

                if (storeId) {
                    const filters = { owner_id: ownerId, store_id: storeId }
                    const storeSetting = await StoreSetting.findOne(filters)

                    if (storeSetting) {
                        const { name, rounding, printing } = storeSetting
                        user['store_setting'] = { name, rounding, printing }
                    }
                }
            }
        }

        user['latmat'] = signToken_1({
            userrole: user.role,
            username: user.username,
            password: user.password,
        })
        user['csrf'] = generateCsrf(res, req)

        user['tz_offset'] = utils.convertGMTOffset(req.body.tz_offset)

        req.session.user = user
        res.redirect(req.session.redirectTo || '/')
    } catch (err) {
        next(err)
    }
}

router
    .get('/signup', (req, res, next) => {
        if (req.isAuthenticated()) {
            return res.redirect('/')
        }

        res.render('auth/signup', {
            title: 'Create new account',
            buttonText: 'Sign Up',
            app: config.APP,
        })
    })
    .post('/signup', (req, res) => {
        const user = new User({
            ...req.body,
            role: DVL, // just dev
        })

        user.save(function (err, user) {
            if (err) {
                console.log(err)

                return res.redirect('/signup?message=' + SIGNUP_ERR)
            }

            user['latmat'] = signToken_1({
                userrole: user.role,
                username: user.username,
                password: user.password,
            })

            user['csrf'] = generateCsrf(res, req)

            req.session.user = user
            res.redirect('/')
        })
    })

router
    .get('/login', (req, res, next) => {
        if (req.isAuthenticated()) {
            return res.redirect('/')
        }

        res.render('auth/login', {
            title: 'Welcome back',
            buttonText: 'Sign In',
            app: config.APP,
        })
    })
    .post('/login', (req, res, next) => {
        const { account_type } = req.body

        passport.authenticate('local', { failureRedirect: '/login' }, async (err, user, info) => {
            await handleLogInfo(user, req)

            if (err) return next(err)
            if (!user) return res.redirect('/login?message=' + SIGNIN_ERR)

            req.logIn(user, (err) => handleLogin({ user, account_type }, req, res, next))
        })(req, res, next)
    })

router.get('/logout', (req, res, next) => {
    req.logout()
    res.redirect('/')
})

module.exports = router
