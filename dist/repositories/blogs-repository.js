"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogsRepository = void 0;
const local_db_1 = require("../db/local-db");
const Blog_1 = require("../models/blog/Blog");
exports.blogsRepository = {
    findBlogs() {
        return local_db_1.storage.blogs;
    },
    createBlog(name, description, websiteUrl) {
        const newBlog = new Blog_1.Blog(name, description, websiteUrl);
        local_db_1.storage.blogs.push(newBlog);
        return newBlog;
    },
    findBlogById(blogId) {
        const blog = local_db_1.storage.blogs.find(blog => blog.id === blogId);
        if (blog) {
            return blog;
        }
        else {
            return null;
        }
    },
    deleteBlogById(blogId) {
        const index = local_db_1.storage.blogs.findIndex(blog => blog.id === blogId);
        if (index !== -1) {
            local_db_1.storage.blogs.splice(index, 1);
            return true;
        }
        else {
            return false;
        }
    },
    updateBlog(blogId, name, description, websiteUrl) {
        const blog = local_db_1.storage.blogs.find(blog => blog.id === blogId);
        if (blog) {
            blog.name = name;
            blog.description = description;
            blog.websiteUrl = websiteUrl;
            return true;
        }
        else {
            return false;
        }
    }
};
