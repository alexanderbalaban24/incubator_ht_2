"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Post = void 0;
class Post {
    constructor(title, shortDescription, content, blogId, blogName, createdAt = new Date().toISOString()) {
        this.title = title;
        this.shortDescription = shortDescription;
        this.content = content;
        this.blogId = blogId;
        this.blogName = blogName;
        this.createdAt = createdAt;
        this.id = new Date().toISOString();
    }
}
exports.Post = Post;
