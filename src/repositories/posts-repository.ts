import {storage} from "../db/local-db";
import {blogsRepository} from "./blogs-repository";
import {Post} from "../models/post/Post";
import {PostType} from "../shared/types";

export const postsRepository = {
    findPost() {
        return storage.posts;
    },
    createPost(title: string, shortDescription: string, content: string, blogId: string) {
        const blog = blogsRepository.findBlogById(blogId);

        if (blog) {
            const newPost = new Post(title, shortDescription, content, blogId, blog.name);
            storage.posts.push(newPost);
            return newPost;
        } else {
            return null;
        }
    },
    findPostById(postId: string) {
        const post = storage.posts.find(post => post.id === postId);

        if (post) {
            return post;
        } else {
            return null;
        }
    },
    updatePost(postId: string, title: string, shortDescription: string, content: string, blogId: string) {
        const blog = blogsRepository.findBlogById(blogId);
        if (!blog) return false;

        const post = this.findPostById(postId);
        if (post) {
            post.title = title;
            post.shortDescription = shortDescription;
            post.content = content;
            post.blogId = blogId;
            return true;
        } else {
            return false;
        }
    },
    deletePostById(postId: string) {
        const index = storage.posts.findIndex(post => post.id === postId);

        if (index !== -1) {
            storage.posts.splice(index, 1);
            return true;
        } else {
            return false;
        }
    }
}