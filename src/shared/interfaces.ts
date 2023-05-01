import {BlogType, PostType} from "./types";

export interface IStorage {
    blogs: BlogType[],
    posts: PostType[]
}