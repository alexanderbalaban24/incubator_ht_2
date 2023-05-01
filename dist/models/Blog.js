"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Blog = void 0;
class Blog {
    constructor(name, description, websiteUrl) {
        this.name = name;
        this.description = description;
        this.websiteUrl = websiteUrl;
        this.id = new Date().toISOString();
    }
}
exports.Blog = Blog;
