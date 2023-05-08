import { Router } from "express";

export const usersRouter = Router();

usersRouter.route('/').get().post().delete()