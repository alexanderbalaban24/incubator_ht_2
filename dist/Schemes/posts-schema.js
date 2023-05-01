"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postValidateSchema = void 0;
const express_validator_1 = require("express-validator");
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
        errorMessage: "Field blogId should be exist and have type string"
    },
}, ['body']);