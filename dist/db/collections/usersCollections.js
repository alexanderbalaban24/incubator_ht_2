"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersCollections = void 0;
const index_1 = require("../index");
exports.usersCollections = index_1.client.db().collection("users");
