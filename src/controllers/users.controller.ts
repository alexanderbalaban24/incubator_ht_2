import {RequestWithBody, RequestWithParams, RequestWithQueryParams, ResponseEmpty} from "../shared/types";
import {ViewUserModel} from "../models/user/ViewUserModel";
import {CreateUserModel} from "../models/user/CreateUserModel";
import {Response} from "express";
import {QueryParamsUserModel} from "../models/user/QueryParamsUserModel";
import {ViewWithQueryUserModel} from "../models/user/ViewWithQueryUserModel";
import {UsersQueryRepository} from "../repositories/users/users-query-repository";
import {UsersServices} from "../domain/users-services";
import {mapStatusCode} from "../shared/utils";
import {HTTPResponseStatusCodes} from "../shared/enums";


export class UsersController {

    constructor(protected usersServices: UsersServices, protected usersQueryRepository: UsersQueryRepository) {
    }

    async getUsers(req: RequestWithQueryParams<QueryParamsUserModel>, res: Response<ViewWithQueryUserModel>) {
        const usersResult = await this.usersQueryRepository.findUsers(req.query);
        if (!usersResult.success) return res.sendStatus(mapStatusCode(usersResult.code))

        res.status(mapStatusCode(usersResult.code)).json(usersResult.payload!);
    }

    async createUser(req: RequestWithBody<CreateUserModel>, res: Response<ViewUserModel>) {
        const createdResult = await this.usersServices.createUser(req.body.login, req.body.email, req.body.password, true);
        if (!createdResult.success) return res.sendStatus(mapStatusCode(createdResult.code));

        const userResult = await this.usersQueryRepository.findUserById(createdResult.payload!.id);
        res.status(HTTPResponseStatusCodes.CREATED).json(userResult.payload!);
    }

    async deleteUser(req: RequestWithParams<{ userId: string }>, res: ResponseEmpty) {
        const deletedResult = await this.usersServices.deleteUserById(req.params.userId);

        res.sendStatus(mapStatusCode(deletedResult.code));
    }
}
