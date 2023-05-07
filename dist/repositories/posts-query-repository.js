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
    findPost() {
        return __awaiter(this, void 0, void 0, function* () {
            const posts = yield postsCollections_1.postsCollections.find({}, { projection: { _id: 0 } }).toArray();
            return posts.map(post => this._mapPostDBToViewPostModel(post));
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
            blogName: post.blogName
        };
    }
};
