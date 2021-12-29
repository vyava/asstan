import * as express from "express";
const validate = require('express-validation');
import * as authController from "../../controllers/auth.controller"
const router = express.Router();
import * as passport from "passport";

// GET /v1/user?kod={bolgeKod}
router
    .route('/register')
    .post(authController.register);
router
    .route('/login')
    .post(passport.authenticate("local", {session: false}), authController.login);
router
    .route('/logout')
    .post(authController.logout);
router
    .route('/verify')
    .post(authController.verify);
router
    .route('/password-reset')
    .post(authController.forgot);
router
    .route('/password-reset/:userId/:token')
    .post(authController.reset)
module.exports = router;