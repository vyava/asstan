import * as express from "express";
import * as passport from "passport";
import * as townController from "../../controllers/town.controller"
const router = express.Router();

// GET /v1/town?cities={cityNames}
router
    .route('/')
    .post(townController.getTownsByCityNames);

module.exports = router;