import * as Joi from 'joi';

const {LIMIT_MAX, LIMIT_MIN, LIMIT_DEFAULT} = require("../../config/vars");

const mailValidation = {
    send : {
        query : {
            gun : Joi.string().required().allow(["bugun", "dun"])
        }
    },
};

export const{ send } = mailValidation