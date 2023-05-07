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
exports.uriParamsValidation = void 0;
const blogs_query_repository_1 = require("../repositories/blogs-query-repository");
const uriParamsValidation = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const blogId = req.params.blogId;
    const blog = yield blogs_query_repository_1.blogsQueryRepository.findBlogById(blogId);
    if (blog) {
        next();
    }
    else {
        res.sendStatus(404);
    }
});
exports.uriParamsValidation = uriParamsValidation;
