import {checkSchema} from "express-validator";

export const resendingSchema = checkSchema({
    email: {
        isString: true,
        trim: true,
        notEmpty: true,
        escape: true,
        matches: {
            options: "^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$"
        },
        errorMessage: "Field email should be exist and have type string"
    }
}, ["body"]);