export { };
import * as express from 'express';
const morgan = require('morgan');
const compress = require('compression');
const methodOverride = require('method-override');
const cors = require('cors');
const cookieParser = require("cookie-parser");
const helmet = require('helmet');
const routes = require('../api/routes/v1');
const { logs } = require('./vars');
const error = require('../api/middlewares/error');
const mongoose = require("./mongoose");
const passport = require("passport");
const session = require("express-session");
import { JWTStrategy, localStrategy, JWTCookieStrategy } from "../api/passport";


/**
 * Express instance
 * @public
 */
const app = express();


// request logging. dev: console | production: file
app.use(morgan(logs));
// parse body params and attache them to req.body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(bodyParser.raw({limit : "5mb"}));

// gzip compression
app.use(compress());

// lets you use HTTP verbs such as PUT or DELETE
// in places where the client doesn't support it
app.use(methodOverride());

// secure apps by setting various HTTP headers
app.use(helmet());

// Enable to work with cookies
app.use(cookieParser());

// enable CORS - Cross Origin Resource Sharing
app.use(cors({
    credentials : true
}));

let whiteList = ["/api/v1/auth/login"];
const ensureAuthenticated = function (req, res, next) {
    if (!whiteList.includes(req.url)) {
        passport.authenticate('jwt', { session: false }, function (err, user, info) {
            console.log(err, user, info)
            if (err) { next(err); }
            if (!user) { return res.status(401).json("Unauthorised") }
            req.user = user;   // Forward user information to the next middleware
            next();
        })(req, res, next);
    }
};

mongoose.connect();

app.use(passport.initialize());
app.use(passport.session());
// Load Passport authentication
passport.use('jwt', JWTStrategy);
passport.use('cookie', JWTCookieStrategy);
passport.use('local', localStrategy);
// require('../api/passport')(passport);

// app.use("*", ensureAuthenticated);
// mount api v1 routes
app.use('/api/v1', routes);

// if error is not an instanceOf APIError, convert it.
app.use(error.converter);

// catch 404 and forward to error handler
app.use(error.notFound);

// error handler, send stacktrace only during development
app.use(error.handler);

module.exports = app;
