export {};
import * as express from 'express';
const authRoutes = require('./auth.route');
const bayilerRoutes = require('./bayiler.route');
const bolgeRoute = require('./bolge.route');
const distRoute = require('./dist.route');
const userRoute = require('./user.route');
const tapdkRoute = require('./tapdk.route');
const mailRoute = require('./mail.route');
const taskRoute = require('./task.route');
const townRoute = require('./town.route');
const incomingRoute = require('./incoming.route');
import * as passport from "passport";
const router = express.Router();

/**
 * GET v1/status
 */
router.get('/status', (req, res) => res.send('OK'));

/**
 * GET v1/docs
 */
// router.use('/docs', express.static('docs'));

router.use('/auth', authRoutes);
router.use('/bayiler', bayilerRoutes);
router.use('/bolge', bolgeRoute);
router.use('/dist', distRoute);
router.use('/user', userRoute);
router.use('/tapdk', tapdkRoute)
router.use('/mail', mailRoute);
router.use('/task', taskRoute);
router.use('/town', townRoute);
router.use('/incoming', incomingRoute);
module.exports = router;
