"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.basicAuthMiddleware = void 0;
const buffer_1 = require("buffer");
const basicAuthMiddleware = (req, res, next) => {
    var _a;
    const token = (_a = req.header("Authorization")) === null || _a === void 0 ? void 0 : _a.split(" ")[1].trim();
    const tokenOrigin = (0, buffer_1.btoa)(`${process.env.LOGIN || "admin"}:${process.env.PASS || "qwerty"}`);
    if (token === tokenOrigin) {
        next();
    }
    else {
        res.sendStatus(401);
    }
};
exports.basicAuthMiddleware = basicAuthMiddleware;
