import {storage} from "../db/local-db";
import {Blog} from "../models/blog/Blog";

export const blogsRepository = {
    findBlogs () {
        return storage.blogs;
    },
    createBlog (name: string, description: string, websiteUrl: string) {
        const newBlog = new Blog(name, description, websiteUrl);
        storage.blogs.push(newBlog);
        return newBlog;
    },
    findBlogById(blogId: string) {
        const blog = storage.blogs.find(blog => blog.id === blogId);
        if (blog) {
            return blog;
        } else {
            return null;
        }
    },
    deleteBlogById(blogId: string) {
        const index = storage.blogs.findIndex(blog => blog.id === blogId);

        if (index !== -1) {
            storage.blogs.splice(index, 1);
            return true;
        } else {
            return false;
        }
    },
    updateBlog(blogId: string, name: string, description: string, websiteUrl: string) {
        const blog = storage.blogs.find(blog => blog.id === blogId);

        if (blog) {
            blog.name = name;
            blog.description = description;
            blog.websiteUrl = websiteUrl;
            return true;
        } else {
            return false;
        }
    }


}