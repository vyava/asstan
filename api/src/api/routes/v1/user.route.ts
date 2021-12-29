import * as express from "express";
import * as passport from "passport";
const validate = require('express-validation');
import * as userController from "../../controllers/user.controller"
import { getUser, setUser, getEmails, createUser } from "../../validations"
const router = express.Router();

// GET /v1/user?kod={bolgeKod}
router
    .route('/')
    .get(userController.getUsersAll);
router
    .route('/me')
    .post(passport.authenticate("jwt", { session : false }), userController.me)
    .put(passport.authenticate("jwt", { session : false }), userController.updateMe)
router
    .route('/dist')
    .get(userController.getUsersWithDist);
router
    .route('/todist')
    .get(userController.setUsers);
module.exports = router;