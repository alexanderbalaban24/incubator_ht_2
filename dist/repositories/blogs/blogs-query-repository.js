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
const blogsCollections_1 = require("../../db/collections/blogsCollections");
exports.blogsQueryRepository = {
    findBlogs(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const cursor = blogsCollections_1.blogsCollections.find({}, { projection: { _id: 0 } });
            const queryResult = yield this._findConstructor(query, cursor);
            const blogs = yield cursor.toArray();
            queryResult.items = blogs.map(blog => this._mapBlogDBToViewBlogModel(blog));
            return queryResult;
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
    },
    _findConstructor(query, cursor) {
        return __awaiter(this, void 0, void 0, function* () {
            const sortBy = query.sortBy ? query.sortBy : "createdAt";
            const sortDirection = query.sortDirection ? query.sortDirection : "desc";
            const pageNumber = query.pageNumber ? +query.pageNumber : 1;
            const pageSize = query.pageSize ? +query.pageSize : 10;
            const skip = pageSize * (pageNumber - 1);
            if (query.searchNameTerm) {
                cursor.filter({ name: { $regex: query.searchNameTerm, $options: 'i' } });
            }
            const arr = yield cursor.toArray();
            cursor.sort({ [sortBy]: sortDirection }).skip(skip).limit(pageSize);
            const pagesCount = Math.ceil(arr.length / pageSize);
            return {
                pagesCount: pagesCount,
                page: pageNumber,
                pageSize: pageSize,
                totalCount: arr.length,
                items: []
            };
        });
    }
};
