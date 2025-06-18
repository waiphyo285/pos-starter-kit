const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

const User = require('@models/mongodb/schemas/user')

// passport local auth
passport.serializeUser(function (user, done) {
    done(null, user)
})

passport.deserializeUser(function (user, done) {
    done(null, user)
})

passport.use(
    new LocalStrategy({ usernameField: 'username', passwordField: 'password' }, async (username, password, done) => {
        // new version - with populate
        const user = await User.findOne({ username }).populate({
            model: 'account',
            path: 'account_id',
            select: 'owner_id store_id staff_id account_type',
        })

        if (!user) return done(null, false)

        user.comparePassword(password, (err, match) => {
            if (err) return done(err, false)

            // prevent data here
            user.password = null

            if (match) return done(null, user)
            return done(null, false)
        })
    })
)
