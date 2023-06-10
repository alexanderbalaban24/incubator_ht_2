import {RequestWithBody, RequestWithParams, RequestWithQueryParams, ResponseEmpty} from "../shared/types";
import {ViewUserModel} from "../models/view/ViewUserModel";
import {CreateUserModel} from "../models/input/CreateUserModel";
import {Response} from "express";
import {QueryParamsUserModel} from "../models/input/QueryParamsUserModel";
import {ViewWithQueryUserModel} from "../models/view/ViewWithQueryUserModel";
import {UsersQueryRepository} from "../repositories/users/users-query-repository";
import {UsersServices} from "../domain/users-services";
import {HTTPResponseStatusCodes} from "../shared/enums";
import {ResponseHelper} from "../shared/helpers";
import {inject, injectable} from "inversify";


@injectable()
export class UsersController extends ResponseHelper {

    constructor(
        @inject(UsersServices) protected usersServices: UsersServices,
        @inject(UsersQueryRepository) protected usersQueryRepository: UsersQueryRepository
    ) {
        super();
    }

    async getUsers(req: RequestWithQueryParams<QueryParamsUserModel>, res: Response<ViewWithQueryUserModel>) {
        const usersResult = await this.usersQueryRepository.findUsers(req.query);

        this.sendResponse(res, usersResult);
    }

    async createUser(req: RequestWithBody<CreateUserModel>, res: Response<ViewUserModel>) {
        const createdResult = await this.usersServices.createUser(req.body.login, req.body.email, req.body.password, true);
        if (!createdResult.success) return res.sendStatus(this.mapStatusCode(createdResult.code));

        const userResult = await this.usersQueryRepository.findUserById(createdResult.payload!.id);
        res.status(HTTPResponseStatusCodes.CREATED).json(userResult.payload!);
    }

    async deleteUser(req: RequestWithParams<{ userId: string }>, res: ResponseEmpty) {
        const deletedResult = await this.usersServices.deleteUserById(req.params.userId);

        this.sendResponse(res, deletedResult);
    }
}
