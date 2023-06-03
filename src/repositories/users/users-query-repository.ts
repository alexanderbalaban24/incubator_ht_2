import {WithId} from "mongodb";
import {ViewUserModel} from "../../models/user/ViewUserModel";
import {QueryParamsUserModel} from "../../models/user/QueryParamsUserModel";
import {UsersDB, UsersModelClass} from "../../models/user/UsersModelClass";
import {ResultDTO} from "../../shared/dto";
import {InternalCode} from "../../shared/enums";
import {ViewWithQueryUserModel} from "../../models/user/ViewWithQueryUserModel";


export class UsersQueryRepository {

    async findUsers(query: QueryParamsUserModel): Promise<ResultDTO<ViewWithQueryUserModel>> {
        const usersData = await UsersModelClass.find({}, {projection: {passwordHash: 0}}).customFind<WithId<UsersDB>, ViewUserModel>(query);
        usersData.map(this._mapUserDBToViewUserModel);

        return new ResultDTO(InternalCode.Success, usersData as ViewWithQueryUserModel);
    }

    async findUserById(userId: string): Promise<ResultDTO<ViewUserModel>> {
        const user = await UsersModelClass.findById(userId, {projection: {passwordHash: 0}});

        if (user) {
            const mappedData = this._mapUserDBToViewUserModel(user);
            return new ResultDTO(InternalCode.Success, mappedData);
        } else {
            return new ResultDTO(InternalCode.Not_Found);
        }

    }

    _mapUserDBToViewUserModel(user: WithId<UsersDB>): ViewUserModel {
        return {
            id: user._id.toString(),
            login: user.login,
            email: user.email,
            createdAt: user.createdAt
        }
    }
}