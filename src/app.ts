import express from "express";
import {testingRouter} from "./routes/testing-router";
import {blogsRouter} from "./routes/blogs-router";
import {postsRouter} from "./routes/posts-router";
import {usersRouter} from "./routes/users-router";
import {authRouter} from "./routes/auth-router";
import {commentsRouter} from "./routes/comments-router";
import cookieParser from "cookie-parser";
import {securityDevices} from "./routes/security-devices";

export const app = express();

app.use(express.json());
app.use(cookieParser());
app.use((req, res, next) => {
    /*console.log("Method : ", req.method);
    console.log("URL : ", req.originalUrl);
    console.log("Body : ", req.body, "\n");*/
    next();
})

app.set('trust proxy', true);
app.use('/security', securityDevices);
app.use('/testing', testingRouter);
app.use('/blogs', blogsRouter);
app.use('/posts', postsRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);
app.use('/comments', commentsRouter);