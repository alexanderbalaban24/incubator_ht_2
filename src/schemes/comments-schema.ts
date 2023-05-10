import {checkSchema} from "express-validator";
import {blogsQueryRepository} from "../repositories/blogs/blogs-query-repository";
import {commentsQueryRepository} from "../repositories/comments/comments-query-repository";


export const commentsSchema = checkSchema({
    content: {
        isString: true,
        trim: true,
        notEmpty: true,
        isLength: {options: {min: 20, max: 300}, errorMessage: "Field content should be length maximum 15"},
        escape: true,
        errorMessage: "Field content should be exist and have type string"
    },
    commentId: {
        isString: true,
        trim: true,
        notEmpty: true,
        isLength: {options: {max: 100000}, errorMessage: "Field commentId should be length maximum 100000"},
        escape: true,
        errorMessage: "Field commentId should be exist and have type string",
        custom: {
            options: async (value: string) => {
                const comment = await commentsQueryRepository.findCommentById(value);
                if (!comment) {
                    return Promise.reject();
                }
            }
        }
    }
}, ["body", "params"])