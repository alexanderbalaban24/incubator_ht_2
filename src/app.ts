import express from "express";
import {testingRouter} from "./routes/testing-router";
import {blogsRouter} from "./routes/blogs-router";
import {postsRouter} from "./routes/posts-router";

export const app = express();

app.use(express.json());
app.use('/testing', testingRouter);
app.use('/blogs', blogsRouter);
app.use('/posts', postsRouter);