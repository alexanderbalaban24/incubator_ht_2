"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postsRepository = void 0;
const local_db_1 = require("../db/local-db");
const blogs_repository_1 = require("./blogs-repository");
const Post_1 = require("../models/post/Post");
exports.postsRepository = {
    findPost() {
        return local_db_1.storage.posts;
    },
    createPost(title, shortDescription, content, blogId) {
        const blog = blogs_repository_1.blogsRepository.findBlogById(blogId);
        if (blog) {
            const newPost = new Post_1.Post(title, shortDescription, content, blogId, blog.name);
            local_db_1.storage.posts.push(newPost);
            return newPost;
        }
        else {
            return null;
        }
    },
    findPostById(postId) {
        const post = local_db_1.storage.posts.find(post => post.id === postId);
        if (post) {
            return post;
        }
        else {
            return null;
        }
    },
    updatePost(postId, title, shortDescription, content, blogId) {
        const blog = blogs_repository_1.blogsRepository.findBlogById(blogId);
        if (!blog)
            return false;
        const post = this.findPostById(postId);
        if (post) {
            post.title = title;
            post.shortDescription = shortDescription;
            post.content = content;
            post.blogId = blogId;
            return true;
        }
        else {
            return false;
        }
    },
    deletePostById(postId) {
        const index = local_db_1.storage.posts.findIndex(post => post.id === postId);
        if (index !== -1) {
            local_db_1.storage.posts.splice(index, 1);
            return true;
        }
        else {
            return false;
        }
    }
};
