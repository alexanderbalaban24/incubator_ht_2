"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.websiteUrlValidation = exports.descriptionValidation = exports.nameValidation = void 0;
const express_validator_1 = require("express-validator");
exports.nameValidation = (0, express_validator_1.body)('name').trim().notEmpty().isLength({ max: 15 }).escape();
exports.descriptionValidation = (0, express_validator_1.body)('description').trim().notEmpty().isLength({ max: 500 }).escape();
exports.websiteUrlValidation = (0, express_validator_1.body)('websiteUrl').trim().notEmpty().isLength({ max: 100 }).matches("^https:\\/\\/([a-zA-Z0-9_-]+\\.)+[a-zA-Z0-9_-]+(\\/[a-zA-Z0-9_-]+)*\\/?$");
