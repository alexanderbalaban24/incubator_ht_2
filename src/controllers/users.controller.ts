import {RequestWithBody, RequestWithParams, RequestWithQueryParams, ResponseEmpty} from "../shared/types";
import {ViewUserModel} from "../models/user/ViewUserModel";
import {CreateUserModel} from "../models/user/CreateUserModel";
import {usersServices} from "../domain/users-services";
import {usersQueryRepository} from "../repositories/users/users-query-repository";
import {Response} from "express";
import {QueryParamsUserModel} from "../models/user/QueryParamsUserModel";
import {ViewWithQueryUserModel} from "../models/user/ViewWithQueryUserModel";
import {HTTPResponseStatusCodes} from "../shared/enums";


export const getUsers = async (req: RequestWithQueryParams<QueryParamsUserModel>, res: Response<ViewWithQueryUserModel>) => {
    const users = await usersQueryRepository.findUsers(req.query);

    res.status(HTTPResponseStatusCodes.OK).json(users);
}

export const createUser = async (req: RequestWithBody<CreateUserModel>, res: Response<ViewUserModel>) => {
    const userId = await usersServices.createUser(req.body.login, req.body.email, req.body.password, true);
    const user = await usersQueryRepository.findUserById(userId);
    res.status(HTTPResponseStatusCodes.CREATED).json(user!);
}

export const deleteUser = async (req: RequestWithParams<{ userId: string }>, res: ResponseEmpty) => {
    const isDeleted = await usersServices.deleteUserById(req.params.userId);

    if (isDeleted) {
        res.sendStatus(HTTPResponseStatusCodes.NO_CONTENT);
    } else {
        res.sendStatus(HTTPResponseStatusCodes.NOT_FOUND);
    }
}
