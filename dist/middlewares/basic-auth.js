"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.basicAuthMiddleware = void 0;
const basicAuthMiddleware = (req, res, next) => {
    var _a, _b;
    const type = (_a = req.header("Authorization")) === null || _a === void 0 ? void 0 : _a.split(" ")[0].trim();
    const token = (_b = req.header("Authorization")) === null || _b === void 0 ? void 0 : _b.split(" ")[1].trim();
    const tokenOrigin = Buffer.from(`${process.env.LOGIN || "admin"}:${process.env.PASS || "qwerty"}`).toString("base64");
    if (token === tokenOrigin && type === "Basic") {
        next();
    }
    else {
        res.sendStatus(401);
    }
};
exports.basicAuthMiddleware = basicAuthMiddleware;
