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
exports.postsQueryRepository = void 0;
const postsCollections_1 = require("../db/collections/postsCollections");
exports.postsQueryRepository = {
    findPost(query, blogId) {
        return __awaiter(this, void 0, void 0, function* () {
            const cursor = yield postsCollections_1.postsCollections.find({}, { projection: { _id: 0 } });
            const queryResult = yield this._findConstructor(query, cursor, blogId);
            const posts = yield cursor.toArray();
            queryResult.items = posts.map(post => this._mapPostDBToViewPostModel(post));
            return queryResult;
        });
    },
    findPostById(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield postsCollections_1.postsCollections.findOne({ id: postId }, { projection: { _id: 0 } });
            if (post) {
                return this._mapPostDBToViewPostModel(post);
            }
            else {
                return null;
            }
        });
    },
    _mapPostDBToViewPostModel(post) {
        return {
            id: post.id,
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId,
            blogName: post.blogName,
            createdAt: post.createdAt
        };
    },
    _findConstructor(query, cursor, blogId) {
        return __awaiter(this, void 0, void 0, function* () {
            const sortBy = query.sortBy ? query.sortBy : "createdAt";
            const sortDirection = query.sortDirection ? query.sortDirection : "desc";
            const pageNumber = query.pageNumber ? +query.pageNumber : 1;
            const pageSize = query.pageSize ? +query.pageSize : 10;
            const skip = pageSize * (pageNumber - 1);
            if (blogId) {
                cursor.filter({ blogId: blogId });
            }
            const totalCount = yield cursor.count();
            cursor.sort({ [sortBy]: sortDirection }).skip(skip).limit(pageSize);
            const pagesCount = Math.ceil(totalCount / pageSize);
            return {
                pagesCount: pagesCount,
                page: pageNumber,
                pageSize: pageSize,
                totalCount: totalCount,
                items: []
            };
        });
    }
};
