import {Response} from "express";
import {RequestEmpty, RequestWithBody, ResponseEmpty} from "../shared/types";
import {LoginModel} from "../models/auth/LoginModel";
import {authServices} from "../domain/auth-services";
import {jwtServices} from "../application/jwt-services";
import {ViewMeModel} from "../models/auth/ViewMeModel";
import {usersQueryRepository} from "../repositories/users/users-query-repository";
import {ViewLoginModel} from "../models/auth/ViewLoginModel";
import {RegistrationModel} from "../models/auth/RegistrationModel";

export const login = async (req: RequestWithBody<LoginModel>, res: Response<ViewLoginModel>) => {
    const userId = await authServices.login(req.body.loginOrEmail, req.body.password);

    if (!userId) {
        res.sendStatus(401);
        return;
    }

    const accessToken = jwtServices.createJWT(userId);
    res.status(200).json(accessToken);
}

export const registration = async (req: RequestWithBody<RegistrationModel>, res: ResponseEmpty) => {
    const success = await authServices.registration(req.body.login, req.body.email, req.body.password);

    if (success) {
        res.sendStatus(204);
    } else {
        res.sendStatus(404);
    }
}

export const confirmRegistration = async (req: RequestWithBody<{code: string}>, res: ResponseEmpty) => {
    const isVerified = await authServices.verifyEmail(req.body.code);

    if (isVerified) {
        res.sendStatus(204)
    } else {
        res.sendStatus(404);
    }
}

export const getMe = async (req: RequestEmpty, res: Response<ViewMeModel>) => {
    const userId = req.userId;

    const user = await usersQueryRepository.findUserById(userId!);

    if (user) {
        res.status(200).json({email: user.email, login: user.login, userId: user.id});
    } else {
        res.sendStatus(404);
    }

}

export const resendConfirmationCode = async (req: RequestWithBody<{ email: string }>, res: ResponseEmpty) => {
    const success = await authServices.resendConfirmationCode(req.body.email);

    if (success) {
        res.sendStatus(204);
    } else {
        res.sendStatus(404);
    }
}
