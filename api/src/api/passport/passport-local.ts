import * as passport from "passport";
const LocalStrategy = require('passport-local').Strategy;
import { User } from "../models/user.model";

passport.serializeUser((user : any, done) => {
    done(null, user._id);
 });
 
 passport.deserializeUser(async (_id: string, done) => {
   const USER = await User.getUser(_id);
   done(null, USER);
 });

// use local strategy
export const localStrategy = new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true,
},
    async (req, email, password, done) => {

        let token = req.cookies['token'];

        let error = new Error();
        
        if(token){
            error.message = "User is already logged in";
            return done(error, null)
        };

        let user = await User.getUserByEmail(email);
        
        if(!user) {
            error.message = "Username or password inccorect";
            return done(error, null);
        }

        let isValid = await user.validatePassword(password);
        if (!isValid) {
            return done(error, null);
        };
        return done(null, user)
    }
);