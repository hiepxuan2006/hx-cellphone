const passport = require("passport")
const { getModel } = require("../connection/database")
const JwtStrategy = require("passport-jwt").Strategy
const ExtractJwt = require("passport-jwt").ExtractJwt
const Account = getModel("Account")

var GoogleStrategy = require("passport-google-oauth20").Strategy
passport.serializeUser(function (user, done) {
  done(null, user)
})

passport.deserializeUser(function (user, done) {
  done(null, user)
})

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID_GOOGLE,
      clientSecret: process.env.CLIENT_SECRET_GOOGLE,
      callbackURL: "http://localhost:5005/auth/google/callback",
    },
    async (req, accessToken, refreshToken, profile, next) => {
      try {
        const isExitsAccount = await Account.findOne({
          id_google: profile.id,
          auth_type: "google",
        })
          .select("-password")
          .lean()
        if (isExitsAccount) return next(null, isExitsAccount)

        console.log(profile)
        const newAccount = {
          auth_type: "google",
          id_google: profile.id,
          name: profile.displayName,
          email: profile.emails[0].value,
          avatar: profile.photos[0].value,
        }

        const isExitAccountLocal = await Account.findOne({
          email: profile.emails[0].value,
          auth_type: "local",
        }).lean()

        if (isExitAccountLocal) {
          await Account.updateOne(
            { email: profile.emails[0].value },
            {
              $push: { auth_type: "google" },
              id_google: profile.id,
              name: profile.displayName,
              avatar: profile.photos[0].value,
            }
          )
          return next(
            null,
            await Account.findOne({ email: profile.emails[0].value })
              .select("-password")
              .lean()
          )
        }
        const account = new Account(newAccount)
        await account.save()
        return next(null, account)
      } catch (error) {
        next(error, false)
      }
    }
  )
)

// /////////////////////
const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
opts.secretOrKey = process.env.SECRET_KEY_TOKEN

passport.use(
  new JwtStrategy(opts, (jwt_payload, done) => {
    try {
      done(null, jwt_payload)
    } catch (error) {
      done(error, false)
    }
  })
)
