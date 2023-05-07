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
exports.blogIdValidateSchema = exports.blogValidateSchema = void 0;
const express_validator_1 = require("express-validator");
const blogs_query_repository_1 = require("../repositories/blogs-query-repository");
exports.blogValidateSchema = (0, express_validator_1.checkSchema)({
    name: {
        isString: true,
        trim: true,
        notEmpty: true,
        isLength: { options: { max: 15 }, errorMessage: "Field name should be length maximum 15" },
        escape: true,
        errorMessage: "Field name should be exist and have type string"
    },
    description: {
        isString: true,
        trim: true,
        notEmpty: true,
        isLength: { options: { max: 500 }, errorMessage: "Field description should be length maximum 500" },
        escape: true,
        errorMessage: "Field name should be exist and have type string"
    },
    websiteUrl: {
        isString: true,
        trim: true,
        notEmpty: true,
        isLength: { options: { max: 100 }, errorMessage: "Field websiteUrl should be length maximum 100" },
        matches: {
            options: "^https:\\/\\/([a-zA-Z0-9_-]+\\.)+[a-zA-Z0-9_-]+(\\/[a-zA-Z0-9_-]+)*\\/?$",
            errorMessage: "Field websiteUrl have unresolved format"
        },
        errorMessage: "Field name should be exist and have type string"
    },
}, ['body']);
exports.blogIdValidateSchema = (0, express_validator_1.checkSchema)({
    blogId: {
        isString: true,
        trim: true,
        notEmpty: true,
        isLength: { options: { max: 100000 }, errorMessage: "Field blogId should be length maximum 100" },
        escape: true,
        errorMessage: "Field blogId should be exist and have type string",
        custom: {
            options: (value) => __awaiter(void 0, void 0, void 0, function* () {
                console.log("QQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQ", value);
                const blog = yield blogs_query_repository_1.blogsQueryRepository.findBlogById(value);
                if (!blog) {
                    return Promise.reject();
                }
            })
        }
    }
}, ['params']);
