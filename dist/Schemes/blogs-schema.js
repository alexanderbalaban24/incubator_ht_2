"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogValidateSchema = void 0;
const express_validator_1 = require("express-validator");
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
