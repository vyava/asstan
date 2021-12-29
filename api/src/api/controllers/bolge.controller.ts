import { NextFunction, Request, Response, Router } from 'express';
import * as _ from "lodash"
import { IBolge } from '../interface';
import * as mongoose from "mongoose";
import "../models/bolge.model";
import "../models/district.model";
import "../models/town.model";
import * as httpStatus from "http-status"
import { District } from '../models/district.model';
const APIError = require('../utils/APIError');

const BolgeModel = mongoose.model("Bolge");

export async function getBolgeById(req: Request, res: Response, next: NextFunction) {

    try {
        let cities = await District.findAllCities();
        // cities = cities.map(city => {
        //     city['yeni'] = city.name.toUpperCase();
        //     city.save();
        //     return city;
        // });

        // let towns = cities.map(city => {
        //     city.towns = city.towns.map(id => {
        //         console.log(id)
        //         return new mongoose.mongo.ObjectId(id)
        //     });
        //     city.save();
        // });
        res.json(cities)
    } catch (err) {
        next(err)
    }

    // try {
    //     let bolgeKod = req.query.kod || null
    //     const bolge = await BolgeModel.find({
    //         bolgeKod: bolgeKod
    //     });
    //     if (_.isEmpty(bolge)) throw new APIError({
    //         message: "Bölge bulunamadı",
    //         status: httpStatus.NOT_FOUND
    //     });
    //     res.json(bolge);
    // } catch (err) {
    //     next(err)
    // }
};