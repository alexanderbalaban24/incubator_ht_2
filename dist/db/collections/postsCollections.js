"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postsCollections = void 0;
const index_1 = require("../index");
exports.postsCollections = index_1.client.db().collection("products");
