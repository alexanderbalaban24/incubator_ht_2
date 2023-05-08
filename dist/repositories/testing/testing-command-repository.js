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
exports.testingCommandRepository = void 0;
const blogsCollections_1 = require("../../db/collections/blogsCollections");
const postsCollections_1 = require("../../db/collections/postsCollections");
exports.testingCommandRepository = {
    deleteAllDB() {
        return __awaiter(this, void 0, void 0, function* () {
            const resDeletedBlogs = yield blogsCollections_1.blogsCollections.deleteMany({});
            const resDeletedPosts = yield postsCollections_1.postsCollections.deleteMany({});
            return resDeletedBlogs.deletedCount === 1 && resDeletedPosts.deletedCount === 1;
        });
    }
};
