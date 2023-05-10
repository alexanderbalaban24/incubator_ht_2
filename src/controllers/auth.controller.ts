import {Response} from "express";
import {RequestEmpty, RequestWithBody} from "../shared/types";
import {LoginModel} from "../models/auth/LoginModel";
import {authServices} from "../domain/auth-services";
import {jwtServices} from "../application/jwt-services";
import {ViewMeModel} from "../models/auth/ViewMeModel";
import {usersQueryRepository} from "../repositories/users/users-query-repository";

//@ts-ignore
export const login = async (req: RequestWithBody<LoginModel>, res: Response<{ accessToken: string }>) => {
    const userId = await authServices.login(req.body.loginOrEmail, req.body.password);

    if (!userId) {
        res.sendStatus(401);
        return;
    }

    const accessToken = jwtServices.createJWT(userId);
    res.status(200).json({accessToken});
}

export const getMe = async (req: RequestEmpty, res: Response<ViewMeModel>) => {
    const userId = req.userId;

    const user = await usersQueryRepository.findUserById(userId!);

        if (user) {
            res.status(200).json({email: user.email,login: user.login,userId: user.id});
        } else {
            res.sendStatus(404);
        }

}
