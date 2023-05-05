"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogsCollections = void 0;
const index_1 = require("../index");
exports.blogsCollections = index_1.client.db().collection("blogs");
