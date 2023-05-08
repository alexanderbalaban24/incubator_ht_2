"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const testing_router_1 = require("./routes/testing-router");
const blogs_router_1 = require("./routes/blogs-router");
const users_router_1 = require("./routes/users-router");
exports.app = (0, express_1.default)();
exports.app.use(express_1.default.json());
exports.app.use('/testing', testing_router_1.testingRouter);
exports.app.use('/blogs', blogs_router_1.blogsRouter);
exports.app.use('/users', users_router_1.usersRouter);
