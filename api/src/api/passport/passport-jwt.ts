const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const { logs, mongo, JWT_SECRET } = require('../../config/vars');
import { User } from "../models/user.model";

var cookieExtractor = function (req) {
    console.log("TOKEN REQUEST : "+req.cookies["token"])
    var token = null;
    if (req && req.cookies) token = req.cookies['token'];
    return token;
};

const options = {
    secretOrKey: JWT_SECRET,
    jwtFromRequest: cookieExtractor
}
export const JWTStrategy = new JwtStrategy(options, async function (payload, done) {
    console.log("PASSPORT TEST")
    try {
        let user = await User.getUser(payload._id);
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
        }

    } catch (error) {
        return done(error, false);
    }
});