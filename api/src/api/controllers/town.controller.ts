import { NextFunction, Request, Response, Router } from 'express';
import * as mongoose from "mongoose";
import { Town } from '../models/town.model';

export async function getTownsByCityNames(req: Request, res: Response, next: NextFunction) {
    let cities = [].concat(req.params.cities);
    try {
        let citiesResult = await Town.getTownsByCityNames(cities);
        res.json(citiesResult)
    } catch (err) {
        next(err)
    };
};