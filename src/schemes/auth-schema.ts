import {checkSchema} from "express-validator";

export const authValidateSchema = checkSchema({
    loginOrEmail: {
        isString: true,
        trim: true,
        notEmpty: true,
        escape: true,
        errorMessage: "Field login should be exist and have type string"
    },
    password: {
        isString: true,
        trim: true,
        notEmpty: true,
        escape: true,
        errorMessage: "Field password should be exist and have type string"
    }
}, ["body"])