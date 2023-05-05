import {client} from "../index";
import {BlogType} from "../../shared/types";


export const blogsCollections = client.db().collection<BlogType>("blogs");