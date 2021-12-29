var CookieStrategy = require('passport-cookie');
import {User} from "../models/user.model";

export const JWTCookieStrategy = new CookieStrategy({
    cookieName: 'token',
    signed: false,
}, async (token, done) => {
    let user = await User.getUserByToken(token);
    
    if(user) return done(null, user);
    
    return done("no user found");
})