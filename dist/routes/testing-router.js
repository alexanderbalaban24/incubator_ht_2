"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testingRouter = void 0;
const express_1 = require("express");
const testing_controller_1 = require("../controllers/testing.controller");
exports.testingRouter = (0, express_1.Router)();
exports.testingRouter.route('/all-data').delete(testing_controller_1.deleteAllData);
