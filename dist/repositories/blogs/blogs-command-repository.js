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
exports.blogsCommandRepository = void 0;
const blogsCollections_1 = require("../../db/collections/blogsCollections");
exports.blogsCommandRepository = {
    createBlog(newBlog) {
        return __awaiter(this, void 0, void 0, function* () {
            yield blogsCollections_1.blogsCollections.insertOne(newBlog);
            return newBlog.id;
        });
    },
    deleteBlogById(blogId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield blogsCollections_1.blogsCollections.deleteOne({ id: blogId });
            return result.deletedCount === 1;
        });
    },
    updateBlog(blogId, name, description, websiteUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield blogsCollections_1.blogsCollections.updateOne({ id: blogId }, { $set: { name, description, websiteUrl } });
            return result.matchedCount === 1;
        });
    }
};
