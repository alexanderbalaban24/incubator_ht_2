"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Blog = void 0;
class Blog {
    constructor(name, description, websiteUrl, createdAt = new Date().toISOString(), isMembership = false) {
        this.name = name;
        this.description = description;
        this.websiteUrl = websiteUrl;
        this.createdAt = createdAt;
        this.isMembership = isMembership;
        this.id = new Date().toISOString();
    }
}
exports.Blog = Blog;
