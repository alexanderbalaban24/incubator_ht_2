import {Request, Response} from "express";
import {storage} from "../db/local-db";

export const deleteAllData = (req: Request, res: Response) => {
    storage.blogs.length = 0;
    storage.posts.length = 0;
    res.sendStatus(204);
}