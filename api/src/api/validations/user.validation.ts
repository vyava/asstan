import * as Joi from 'joi';

const { LIMIT_MAX, LIMIT_MIN, LIMIT_DEFAULT } = require("../../config/vars");

const distValidation = {
    getUser: {
        query: {
            id: Joi.number().required()
        }
    },
    setUser: {
        query: {
            name: Joi.string().required()
        }
    },
    getEmails: {
        query: {
            name: Joi.string().required().uppercase()
        }
    },
    createUser: {
        body: {
            name: Joi.string().required(),
            email: Joi.string().email().required(),
            // password: Joi.any()
            //     .valid(Joi.ref('password'))
            //     .required()
        }
    }
};

export const { getUser, setUser, getEmails, createUser } = distValidation