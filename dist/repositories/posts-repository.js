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
exports.postsRepository = void 0;
const postsCollections_1 = require("../db/collections/postsCollections");
const blogsCollections_1 = require("../db/collections/blogsCollections");
exports.postsRepository = {
    findPost() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield postsCollections_1.postsCollections.find({}, { projection: { _id: 0 } }).toArray();
        });
    },
    createPost(newPost) {
        return __awaiter(this, void 0, void 0, function* () {
            yield postsCollections_1.postsCollections.insertOne(Object.assign({}, newPost));
            return newPost;
        });
    },
    findPostById(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield postsCollections_1.postsCollections.findOne({ id: postId }, { projection: { _id: 0 } });
        });
    },
    updatePost(postId, title, shortDescription, content, blogId) {
        return __awaiter(this, void 0, void 0, function* () {
            const blog = yield blogsCollections_1.blogsCollections.findOne({ id: blogId });
            if (!blog)
                return false;
            const result = yield postsCollections_1.postsCollections.updateOne({ id: postId }, {
                $set: {
                    title,
                    shortDescription,
                    content,
                    blogId
                }
            });
            return result.matchedCount === 1;
        });
    },
    deletePostById(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield postsCollections_1.postsCollections.deleteOne({ id: postId });
            return result.deletedCount === 1;
        });
    }
};
