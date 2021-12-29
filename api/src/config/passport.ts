import User from "../api/models/user.model";
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt;
var crypto = require("crypto");
// const passport = require('passport');
const bcrypt = require('bcrypt');
const { logs, mongo, JWT_SECRET } = require('./vars');

function validPassword(password, hash, salt) {
    var hashVerify = crypto
        .pbkdf2Sync(password, salt, 10000, 64, "sha512")
        .toString("hex");
    return hash === hashVerify;
}

function genPassword(password) {
    var salt = crypto.randomBytes(32).toString("hex");
    var genHash = crypto
        .pbkdf2Sync(password, salt, 10000, 64, "sha512")
        .toString("hex");

    return {
        salt: salt,
        hash: genHash,
    };
};

passport.use(
    new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        // passReqToCallback : true
    }, async (email, password, done) => {
        console.log(email, password, done)
        try {
            
            let user = await User.findOne({ "email.address": email });
    
            if(!user){
                return done(null, false, {message : "User not found"})
            };
    
            const isValid = validPassword(password, user.hash, user.salt);
    
            if(!isValid) {
                return done(null, false, { message: 'Wrong Password' });
            };
    
            return done(null, user, { message: 'Logged in Successfully' });
        } catch (error) {
            return done(error)
        };
    })
);

// At a minimum, you must pass these options (see note after this code snippet for more)
const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: JWT_SECRET
  };

// The JWT payload is passed into the verify callback
passport.use(new JwtStrategy(options, function(jwt_payload, done) {
    console.log("JWT payload")
    console.log(jwt_payload)
    // We will assign the `sub` property on the JWT to the database ID of user
    User.findOne({_id: jwt_payload._id}, function(err, user) {
        // This flow look familiar?  It is the same as when we implemented
        // the `passport-local` strategy
        console.log(user)
        if (err) {
            return done(err, false);
        }
        if (user) {
            console.log("user found");
            console.log(user)
            return done(null, user);
        } else {
            return done(null, false);
        }
        
    });
    
}));

passport.serializeUser(function (user, cb) {
    cb(null, user.id);
});

passport.deserializeUser(function (id, cb) {
    User.findById(id, function (err, user) {
        if (err) {
            return cb(err);
        }
        cb(null, user);
    });
});

// passport.use(
//     'login',
//     new LocalStrategy({
//         usernameField: 'email',
//         passwordField: 'password'
//     }, async (email, password, cb) => {

//         let user = await User.getUserByEmail(email);
//         console.log('User: ', email, password);

//         if (!user) return cb(null, false, { message: "Incorrect user or password." });

//         return cb(null,
//             { email },
//             { message: 'Logged In Successfully' });
//     }));

export { passport };