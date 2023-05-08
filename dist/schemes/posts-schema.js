"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postValidateSchema = void 0;
const express_validator_1 = require("express-validator");
const blogs_query_repository_1 = require("../repositories/blogs/blogs-query-repository");
exports.postValidateSchema = (0, express_validator_1.checkSchema)({
    title: {
        isString: true,
        trim: true,
        notEmpty: true,
        isLength: { options: { max: 30 }, errorMessage: "Field title should be length maximum 30" },
        escape: true,
        errorMessage: "Field title should be exist and have type string"
    },
    shortDescription: {
        isString: true,
        trim: true,
        notEmpty: true,
        isLength: { options: { max: 100 }, errorMessage: "Field shortDescription should be length maximum 100" },
        escape: true,
        errorMessage: "Field shortDescription should be exist and have type string"
    },
    content: {
        isString: true,
        trim: true,
        notEmpty: true,
        isLength: { options: { max: 1000 }, errorMessage: "Field content should be length maximum 1000" },
        escape: true,
        errorMessage: "Field content should be exist and have type string"
    },
    blogId: {
        isString: true,
        trim: true,
        notEmpty: true,
        isLength: { options: { max: 100000 }, errorMessage: "Field blogId should be length maximum 100" },
        escape: true,
        errorMessage: "Field blogId should be exist and have type string",
        custom: {
            options: (value) => __awaiter(void 0, void 0, void 0, function* () {
                const blog = yield blogs_query_repository_1.blogsQueryRepository.findBlogById(value);
                if (!blog) {
                    return Promise.reject();
                }
            })
        }
    },
}, ['body', 'params']);
