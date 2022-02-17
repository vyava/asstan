import { NextFunction, Request, Response } from 'express';
import { User } from '../models/user.model';
const passport = require("passport");
import * as jwt from "jsonwebtoken";
import { IUser } from '../interface';
const config = require("../../config/vars");
const APIError = require("../utils/APIError");
import { sendOne } from "./mail.controller";
import { Distributor } from '../models';


export const authenticateJwt = passport.authenticate('jwt', { session: false });
export const authenticateLocal = passport.authenticate('local', { session: false });
export const authenticateGoogle = passport.authenticate('google', { scope: ['profile', 'email'] });
export const authenticateFacebook = passport.authenticate('facebook', { scope: ['email'] });

export async function register(req: Request, res: Response, next: NextFunction) {
    try {
        if (!req.body.email && !req.body.password) return res.json("bilgiler eksik");
        let userFound = await User.findOne({ "email.address": req.body.email });
        if (userFound) throw new Error(`${userFound.email.address} is already exist!`);

        let result = await User.createUser({
            name: req.body.name || '',
            email: req.body.email,
            password: req.body.password
        });
        res.status(201).json(result);

    } catch (error) {
        next(error)
    }
};

export async function verify(req: Request, res: Response, next: NextFunction) {
    try {
        let token = req.cookies["token"];
        return jwt.verify(token, config.JWT_SECRET)
    } catch (error) {
        return res.status(401).json({
            message: 'Token is expired'
        })
    }
}

export async function login(req: Request, res: Response, next: NextFunction) {
    try {
        let user: IUser = req.user;
        const access_token = jwt.sign({ _id: user._id }, config.JWT_SECRET, { expiresIn: '1d' });
        res.cookie("token", access_token, {
            httpOnly : true,
            maxAge : 1 * 24 * 3600000
        });

        let districts = await Distributor.getDistrictsByDistIds(user.distributor as any[]);

        res.status(200).json({ user, access_token, districts });

    } catch (error) {
        next(error)
    }
};

export async function logout(req: Request, res: Response, next: NextFunction) {
    try {
        req.user = null;
        res.clearCookie('token');
        res.status(200).json("signout successfull")
    } catch (error) {
        next(error)
    }
};

export async function forgot(req: Request, res: Response, next: NextFunction) {
    try {
        let { _id, hash, email : { address } } = await User.findOne({"email.address" : req.body.email});

        console.log(_id, hash, address)

        let replacedHash = (hash || 'NO_HASH').replace(/\//g, '--');

        let link = `http://localhost:8080/password-reset/${_id}/${replacedHash}`;

        let message = `
            <div>
                <b>Şifre sıfırlama</b>
                <br />
                <p>Şifrenizi aşağıdaki linke tıklayarak sıfırlayabilirsiniz</p>
                <br />
                <br />
                ${link}
            </div>
        `;

        let result =  await sendOne(address, message);

        res.json(result);

    } catch (error) {
        next(error)
    }
};

export async function reset(req: Request, res: Response, next: NextFunction) {
    try {
        res.json(true)
        // res.json({
        //     userId: req.params.userId,
        //     token: req.params.token
        // });
    } catch (error) {
        next(error)
    }
};