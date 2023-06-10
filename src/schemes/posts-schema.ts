import {checkSchema} from "express-validator";
import {container} from "../inversify.config";
import {BlogsQueryRepository} from "../repositories/blogs/blogs-query-repository";

const blogsQueryRepository = container.resolve(BlogsQueryRepository);

export const postValidateSchema = checkSchema({
    title: {
        isString: true,
        trim: true,
        notEmpty: true,
        isLength: {options: {max: 30}, errorMessage: "Field title should be length maximum 30"},
        escape: true,
        errorMessage: "Field title should be exist and have type string"
    },
    shortDescription: {
        isString: true,
        trim: true,
        notEmpty: true,
        isLength: {options: {max: 100}, errorMessage: "Field shortDescription should be length maximum 100"},
        escape: true,
        errorMessage: "Field shortDescription should be exist and have type string"
    },
    content: {
        isString: true,
        trim: true,
        notEmpty: true,
        isLength: {options: {max: 1000}, errorMessage: "Field content should be length maximum 1000"},
        escape: true,
        errorMessage: "Field content should be exist and have type string"
    },
    blogId: {
        isString: true,
        trim: true,
        notEmpty: true,
        isLength: {options: {max: 100000}, errorMessage: "Field blogId should be length maximum 100000"},
        escape: true,
        errorMessage: "Field blogId should be exist and have type string",
        custom: {
            options: async (value: string) => {
                const blog = await blogsQueryRepository.findBlogById(value);
                if (!blog) {
                    return Promise.reject();
                }
            }
        }
    },
}, ['body', 'params'])