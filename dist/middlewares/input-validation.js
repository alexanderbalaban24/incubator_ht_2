"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inputValidationMiddleware = void 0;
const express_validator_1 = require("express-validator");
const inputValidationMiddleware = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        next();
    }
    else {
        const resultError = errors.array({ onlyFirstError: true }).map((err) => {
            if (err.type === 'field') {
                return {
                    message: err.msg,
                    field: err.path
                };
            }
        });
        res.status(400).json({ errorsMessages: resultError });
    }
};
exports.inputValidationMiddleware = inputValidationMiddleware;
