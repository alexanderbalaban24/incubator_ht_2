import {Blog} from "../models/blog/Blog";
import {IStorage} from "../shared/interfaces";

export const storage: IStorage = {
    blogs: [
        new Blog("IT_Boroda", "Test description", "https://it-blabla.com"),
        new Blog("IT_Boroda", "Test description", "https://it-blabla.com")
    ],
    posts: []
}