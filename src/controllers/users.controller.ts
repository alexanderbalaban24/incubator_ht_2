import {RequestWithBody, RequestWithParams, RequestWithQueryParams, ResponseEmpty} from "../shared/types";
import {ViewUserModel} from "../models/user/ViewUserModel";
import {CreateUserModel} from "../models/user/CreateUserModel";
import {Response} from "express";
import {QueryParamsUserModel} from "../models/user/QueryParamsUserModel";
import {ViewWithQueryUserModel} from "../models/user/ViewWithQueryUserModel";
import {HTTPResponseStatusCodes} from "../shared/enums";
import {UsersQueryRepository} from "../repositories/users/users-query-repository";
import {UsersServices} from "../domain/users-services";


export class UsersController {

    constructor(protected usersServices: UsersServices, protected usersQueryRepository: UsersQueryRepository){}
    async getUsers(req: RequestWithQueryParams<QueryParamsUserModel>, res: Response<ViewWithQueryUserModel>) {
        const users = await this.usersQueryRepository.findUsers(req.query);

        res.status(HTTPResponseStatusCodes.OK).json(users);
    }

    async createUser(req: RequestWithBody<CreateUserModel>, res: Response<ViewUserModel>) {
        const userId = await this.usersServices.createUser(req.body.login, req.body.email, req.body.password, true);
        const user = await this.usersQueryRepository.findUserById(userId);
        res.status(HTTPResponseStatusCodes.CREATED).json(user!);
    }

    async deleteUser(req: RequestWithParams<{ userId: string }>, res: ResponseEmpty) {
        const isDeleted = await this.usersServices.deleteUserById(req.params.userId);

        if (isDeleted) {
            res.sendStatus(HTTPResponseStatusCodes.NO_CONTENT);
        } else {
            res.sendStatus(HTTPResponseStatusCodes.NOT_FOUND);
        }
    }
}
