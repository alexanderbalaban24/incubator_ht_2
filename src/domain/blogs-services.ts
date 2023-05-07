import {Blog} from "../models/blog/Blog";
import {blogsRepository} from "../repositories/blogs-repository";

export const blogsServices = {
    async findBlogs() {
        return await blogsRepository.findBlogs();
    },
    async createBlog(name: string, description: string, websiteUrl: string) {
        return await blogsRepository.createBlog(new Blog(name, description, websiteUrl));
    },
    async findBlogById(blogId: string) {
        return await blogsRepository.findBlogById(blogId);
    },
    async deleteBlogById(blogId: string) {
        return await blogsRepository.deleteBlogById(blogId);
    },
    async updateBlog(blogId: string, name: string, description: string, websiteUrl: string) {
        return await blogsRepository.updateBlog(blogId, name, description, websiteUrl);
    }


}