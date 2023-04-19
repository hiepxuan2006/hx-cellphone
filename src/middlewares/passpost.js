const passport = require('passport');
const { getModel } = require('../connection/database');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const Account = getModel('Account');

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

// /////////////////////
const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = 'hiepxuan19980620';

passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
        try {
            done(null, jwt_payload);
        } catch (error) {
            done(error, false);
        }
    }),
);
