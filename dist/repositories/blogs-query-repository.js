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
exports.blogsQueryRepository = void 0;
const blogsCollections_1 = require("../db/collections/blogsCollections");
exports.blogsQueryRepository = {
    findBlogs() {
        return __awaiter(this, void 0, void 0, function* () {
            const blogs = yield blogsCollections_1.blogsCollections.find({}, { projection: { _id: 0 } }).toArray();
            return blogs.map(blog => this._mapBlogDBToViewBlogModel(blog));
        });
    },
    findBlogById(blogId) {
        return __awaiter(this, void 0, void 0, function* () {
            const blog = yield blogsCollections_1.blogsCollections.findOne({ id: blogId }, { projection: { _id: 0 } });
            if (blog) {
                return this._mapBlogDBToViewBlogModel(blog);
            }
            else {
                return null;
            }
        });
    },
    _mapBlogDBToViewBlogModel(blog) {
        return {
            id: blog.id,
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
            createdAt: blog.createdAt,
            isMembership: blog.isMembership
        };
    }
};
