import {checkSchema} from "express-validator";


export const likeSchema = checkSchema({
    likeStatus: {
        isString: true,
        trim: true,
        notEmpty: true,
        escape: true,
        isIn: {
            options: [["None", "Like", "Dislike"]],
            errorMessage: "Field likeStatus should equal to expected"
        }
    }
}, ["body"])