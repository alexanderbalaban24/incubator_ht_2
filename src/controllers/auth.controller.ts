import {Response} from "express";
import {RequestEmpty, RequestWithBody, ResponseEmpty} from "../shared/types";
import {LoginModel} from "../models/auth/LoginModel";
import {authServices} from "../domain/auth-services";
import {ViewMeModel} from "../models/auth/ViewMeModel";
import {usersQueryRepository} from "../repositories/users/users-query-repository";
import {ViewLoginModel} from "../models/auth/ViewLoginModel";
import {RegistrationModel} from "../models/auth/RegistrationModel";

export const login = async (req: RequestWithBody<LoginModel>, res: Response<ViewLoginModel>) => {
    const tokenPair = await authServices.login(req.body.loginOrEmail, req.body.password, req.headers["user-agent"], req.ip);

    if (tokenPair && tokenPair.accessToken && tokenPair.refreshToken) {
        res.cookie("refreshToken", tokenPair.refreshToken, {httpOnly: true, secure: true});
        res.status(200).json({accessToken: tokenPair.accessToken});
    } else {
        res.sendStatus(401);
    }
}

export const refreshToken = async (req: RequestEmpty, res: Response<ViewLoginModel>) => {
    const userId = req.userId;

    if (!userId) {
        res.sendStatus(401);
    }

    const refreshToken = req.cookies.refreshToken;

    const tokenPair = await authServices.refreshToken(refreshToken, userId!);

    if (tokenPair && tokenPair.accessToken && tokenPair.refreshToken) {
        res.cookie("refreshToken", tokenPair.refreshToken, {httpOnly: true, secure: true});
        res.status(200).json({accessToken: tokenPair.accessToken});
    } else {
        res.sendStatus(401);
    }
}

export const registration = async (req: RequestWithBody<RegistrationModel>, res: ResponseEmpty) => {
    const success = await authServices.registration(req.body.login, req.body.email, req.body.password);

    if (success) {
        res.sendStatus(204);
    } else {
        res.sendStatus(404);
    }
}

export const confirmRegistration = async (req: RequestWithBody<{ code: string }>, res: ResponseEmpty) => {
    const isVerified = await authServices.verifyEmail(req.body.code);

    if (isVerified) {
        res.sendStatus(204)
    } else {
        res.sendStatus(404);
    }
}

export const revokeRefreshToken = async (req: RequestEmpty, res: ResponseEmpty) => {
    const refreshToken = req.cookies.refreshToken;

    const isRevoked = await authServices.revokeRefreshToken(refreshToken);

    if (isRevoked) {
        res.sendStatus(204);
    } else {
        res.sendStatus(401);
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
