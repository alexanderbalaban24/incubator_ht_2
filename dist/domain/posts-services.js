"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postsServices = void 0;
const posts_repository_1 = require("../repositories/posts-repository");
const blogs_repository_1 = require("../repositories/blogs-repository");
exports.postsServices = {
    findPost() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield posts_repository_1.postsRepository.findPost();
        });
    },
    createPost(title, shortDescription, content, blogId) {
        return __awaiter(this, void 0, void 0, function* () {
            const blog = yield blogs_repository_1.blogsRepository.findBlogById(blogId);
            if (!blog)
                return null;
            const newPost = {
                id: new Date().toISOString(),
                title,
                shortDescription,
                content,
                blogId,
                blogName: blog.name,
                createdAt: new Date().toISOString()
            };
            return yield posts_repository_1.postsRepository.createPost(newPost);
        });
    },
    findPostById(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield posts_repository_1.postsRepository.findPostById(postId);
        });
    },
    updatePost(postId, title, shortDescription, content, blogId) {
        return __awaiter(this, void 0, void 0, function* () {
            const blog = yield blogs_repository_1.blogsRepository.findBlogById(blogId);
            if (!blog)
                return false;
            return yield posts_repository_1.postsRepository.updatePost(postId, title, shortDescription, content, blogId);
        });
    },
    deletePostById(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield posts_repository_1.postsRepository.deletePostById(postId);
        });
    }
};
