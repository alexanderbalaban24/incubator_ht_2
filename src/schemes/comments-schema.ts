import {checkSchema} from "express-validator";


export const commentsSchema = checkSchema({
    content: {
        isString: true,
        trim: true,
        notEmpty: true,
        isLength: {options: {min: 20, max: 300}, errorMessage: "Field content should be length maximum 15"},
        escape: true,
        errorMessage: "Field content should be exist and have type string"
    }
}, ["body"])