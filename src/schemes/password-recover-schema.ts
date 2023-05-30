import {checkSchema} from "express-validator";


export const passwordRecoverSchema = checkSchema({
    email: {
        isString: true,
        trim: true,
        notEmpty: true,
        escape: true,
        matches: {
            options: "^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$"
        },
        errorMessage: "Field email should be have expected format"
    }
})