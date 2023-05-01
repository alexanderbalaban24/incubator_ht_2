"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storage = void 0;
const Blog_1 = require("../models/blog/Blog");
exports.storage = {
    blogs: [
        new Blog_1.Blog("IT_Boroda", "Test description", "https://it-blabla.com"),
        new Blog_1.Blog("IT_Boroda", "Test description", "https://it-blabla.com")
    ],
    posts: []
};
