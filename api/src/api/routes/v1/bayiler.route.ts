export { };
// const express = require('express');
import * as express from "express"
import { Bayi } from "../../models";
const validate = require('express-validation');
// const controller = require('../../controllers/user.controller');
import * as controller from "../../controllers/bayi.controller"
// import {load} from "../../controllers/user.controller"
const { authorize, ADMIN, LOGGED_USER } = require('../../middlewares/auth');
// const { createUser, replaceUser, updateUser } = require('../../validations/bayi.validation');
import { getSehir, getIlce, getBayi, findByRuhsatNo } from "../../validations/bayi.validation";
import * as passport from "passport";

const router = express.Router();

router
  .route("/")
  .post(passport.authenticate("cookie", {session: false}), controller.getBayiler);

router
  .route('/')
  .post(passport.authenticate("cookie", {session: false}), controller.downloadBayiler)

router
  .route("/bugun")
  .get(controller.getBayiler)
router
  .route('/tapdk')
  .get(controller.getBayilerByTapdk)

// router
//   .route("/set")
//   .get(controller.setValueToBayiler);


// router
//   .route("/getArray")
//   .get(controller.getBayilerByGroup);

/**
 * @api {get} v1/bayiler?ruhsatNo Get Bayi
 * @apiDescription Retrive bayi by ruhsatNo 
 * @apiVersion 1.0.0
 * @apiPermission <BAYİ>
 *
 * @apiHeader {String} Athorization  User's access token
 *
 * @apiSuccess (200) Successfully retrieved
 *
 * @apiError (Unauthorized 401) Unauthorized  Only authenticated users can delete the data
 * @apiError (Forbidden 403)    Forbidden     Only user with same id or admins can delete the data
 * @apiError (Not Found 500)    NotFound      Bayi bulunamadı
 * **/
router
  .route("/bayi/:id")

  .get(controller.getBayiById);
router
  .route("/new")

  .get(controller.newBayi);
router
  .route('/:sehir')
  // .get((req, res) => {
  //   res.json("ok")
  // })
  .get(validate(getSehir), controller.getBayilerBySehir);
/**
 * @api {get} v1/users List Users
 * @apiDescription Get a list of users
 * @apiVersion 1.0.0
 * @apiName ListUsers
 * @apiGroup User
 * @apiPermission admin
 *
 * @apiHeader {String} Athorization  User's access token
 *
 * @apiParam  {Number{1-}}         [page=1]     List page
 * @apiParam  {Number{1-100}}      [perPage=1]  Users per page
 * @apiParam  {String}             [name]       User's name
 * @apiParam  {String}             [email]      User's email
 * @apiParam  {String=user,admin}  [role]       User's role
 *
 * @apiSuccess {Object[]} users List of users.
 *
 * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
 * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
 */
// .get(authorize(ADMIN), validate(listUsers), controller.list)
/**
 * @api {post} v1/users Create User
 * @apiDescription Create a new user
 * @apiVersion 1.0.0
 * @apiName CreateUser
 * @apiGroup User
 * @apiPermission admin
 *
 * @apiHeader {String} Athorization  User's access token
 *
 * @apiParam  {String}             email     User's email
 * @apiParam  {String{6..128}}     password  User's password
 * @apiParam  {String{..128}}      [name]    User's name
 * @apiParam  {String=user,admin}  [role]    User's role
 *
 * @apiSuccess (Created 201) {String}  id         User's id
 * @apiSuccess (Created 201) {String}  name       User's name
 * @apiSuccess (Created 201) {String}  email      User's email
 * @apiSuccess (Created 201) {String}  role       User's role
 * @apiSuccess (Created 201) {Date}    createdAt  Timestamp
 *
 * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
 * @apiError (Unauthorized 401)  Unauthorized     Only authenticated users can create the data
 * @apiError (Forbidden 403)     Forbidden        Only admins can create the data
 */
// .post(authorize(ADMIN), validate(createUser), controller.create);

// router
//   .route('/profile')
/**
 * @api {get} v1/users/profile User Profile
 * @apiDescription Get logged in user profile information
 * @apiVersion 1.0.0
 * @apiName UserProfile
 * @apiGroup User
 * @apiPermission user
 *
 * @apiHeader {String} Athorization  User's access token
 *
 * @apiSuccess {String}  id         User's id
 * @apiSuccess {String}  name       User's name
 * @apiSuccess {String}  email      User's email
 * @apiSuccess {String}  role       User's role
 * @apiSuccess {Date}    createdAt  Timestamp
 *
 * @apiError (Unauthorized 401)  Unauthorized  Only authenticated Users can access the data
 */
// .get(authorize(), controller.loggedIn);

// router
//   .route('/:userId')
/**
 * @api {get} v1/users/:id Get User
 * @apiDescription Get user information
 * @apiVersion 1.0.0
 * @apiName GetUser
 * @apiGroup User
 * @apiPermission user
 *
 * @apiHeader {String} Athorization  User's access token
 *
 * @apiSuccess {String}  id         User's id
 * @apiSuccess {String}  name       User's name
 * @apiSuccess {String}  email      User's email
 * @apiSuccess {String}  role       User's role
 * @apiSuccess {Date}    createdAt  Timestamp
 *
 * @apiError (Unauthorized 401) Unauthorized Only authenticated users can access the data
 * @apiError (Forbidden 403)    Forbidden    Only user with same id or admins can access the data
 * @apiError (Not Found 404)    NotFound     User does not exist
 */
// .get(authorize(LOGGED_USER), controller.get)
/**
 * @api {put} v1/users/:id Replace User
 * @apiDescription Replace the whole user document with a new one
 * @apiVersion 1.0.0
 * @apiName ReplaceUser
 * @apiGroup User
 * @apiPermission user
 *
 * @apiHeader {String} Athorization  User's access token
 *
 * @apiParam  {String}             email     User's email
 * @apiParam  {String{6..128}}     password  User's password
 * @apiParam  {String{..128}}      [name]    User's name
 * @apiParam  {String=user,admin}  [role]    User's role
 * (You must be an admin to change the user's role)
 *
 * @apiSuccess {String}  id         User's id
 * @apiSuccess {String}  name       User's name
 * @apiSuccess {String}  email      User's email
 * @apiSuccess {String}  role       User's role
 * @apiSuccess {Date}    createdAt  Timestamp
 *
 * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
 * @apiError (Unauthorized 401) Unauthorized Only authenticated users can modify the data
 * @apiError (Forbidden 403)    Forbidden    Only user with same id or admins can modify the data
 * @apiError (Not Found 404)    NotFound     User does not exist
 */
// .put(authorize(LOGGED_USER), validate(replaceUser), controller.replace)
/**
 * @api {patch} v1/users/:id Update User
 * @apiDescription Update some fields of a user document
 * @apiVersion 1.0.0
 * @apiName UpdateUser
 * @apiGroup User
 * @apiPermission user
 *
 * @apiHeader {String} Athorization  User's access token
 *
 * @apiParam  {String}             email     User's email
 * @apiParam  {String{6..128}}     password  User's password
 * @apiParam  {String{..128}}      [name]    User's name
 * @apiParam  {String=user,admin}  [role]    User's role
 * (You must be an admin to change the user's role)
 *
 * @apiSuccess {String}  id         User's id
 * @apiSuccess {String}  name       User's name
 * @apiSuccess {String}  email      User's email
 * @apiSuccess {String}  role       User's role
 * @apiSuccess {Date}    createdAt  Timestamp
 *
 * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
 * @apiError (Unauthorized 401) Unauthorized Only authenticated users can modify the data
 * @apiError (Forbidden 403)    Forbidden    Only user with same id or admins can modify the data
 * @apiError (Not Found 404)    NotFound     User does not exist
 */
// .patch(authorize(LOGGED_USER), validate(updateUser), controller.update)
/**
 * @api {patch} v1/users/:id Delete User
 * @apiDescription Delete a user
 * @apiVersion 1.0.0
 * @apiName DeleteUser
 * @apiGroup User
 * @apiPermission user
 *
 * @apiHeader {String} Athorization  User's access token
 *
 * @apiSuccess (No Content 204)  Successfully deleted
 *
 * @apiError (Unauthorized 401) Unauthorized  Only authenticated users can delete the data
 * @apiError (Forbidden 403)    Forbidden     Only user with same id or admins can delete the data
 * @apiError (Not Found 404)    NotFound      User does not exist
 */
// .delete(authorize(LOGGED_USER), controller.remove);

module.exports = router;
