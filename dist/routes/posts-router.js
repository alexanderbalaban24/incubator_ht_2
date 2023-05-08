"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postsRouter = void 0;
const express_1 = require("express");
const basic_auth_1 = require("../middlewares/basic-auth");
const posts_controller_1 = require("../controllers/posts.controller");
const posts_schema_1 = require("../schemes/posts-schema");
const input_validation_1 = require("../middlewares/input-validation");
exports.postsRouter = (0, express_1.Router)();
exports.postsRouter.route('/')
    .get(posts_controller_1.getAllPosts)
    .post(basic_auth_1.basicAuthMiddleware, posts_schema_1.postValidateSchema, input_validation_1.inputValidationMiddleware, posts_controller_1.createPost);
exports.postsRouter.route('/:postId')
    .get(posts_controller_1.getPost)
    .put(basic_auth_1.basicAuthMiddleware, posts_schema_1.postValidateSchema, input_validation_1.inputValidationMiddleware, posts_controller_1.updatePost)
    .delete(basic_auth_1.basicAuthMiddleware, posts_controller_1.deletePost);
