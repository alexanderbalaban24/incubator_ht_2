import {WithId} from "mongodb";
import {ViewUserModel} from "../../models/user/ViewUserModel";
import {QueryParamsUserModel} from "../../models/user/QueryParamsUserModel";
import {ViewWithQueryUserModel} from "../../models/user/ViewWithQueryUserModel";
import {UsersDB, UsersModelClass} from "../../db";
import {Query} from "mongoose";


export class UsersQueryRepository {
    async findUsers(query: QueryParamsUserModel): Promise<ViewWithQueryUserModel> {
        const userInstances = UsersModelClass.find({}, {projection: {passwordHash: 0}});

        const queryResult = await this._queryBuilder(query, userInstances);

        const users = await userInstances;
        queryResult.items = users.map(user => this._mapUserDBToViewUserModel(user));

        return queryResult;
    }
    async findUserById(userId: string): Promise<ViewUserModel | null> {
        const user = await UsersModelClass.findById(userId, {projection: {passwordHash: 0}});

        if (user) {
            return this._mapUserDBToViewUserModel(user);
        } else {
            return null;
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
    async _queryBuilder(queryUserData: QueryParamsUserModel, query: Query<any, any>): Promise<ViewWithQueryUserModel> {
        const sortBy = queryUserData.sortBy ? queryUserData.sortBy : "createdAt";
        const sortDirection = queryUserData.sortDirection ? queryUserData.sortDirection : "desc"
        const pageNumber = queryUserData.pageNumber ? +queryUserData.pageNumber : 1
        const pageSize = queryUserData.pageSize ? +queryUserData.pageSize : 10

        const skip = pageSize * (pageNumber - 1);

        if (queryUserData.searchLoginTerm) {
            query.regex("login", new RegExp(queryUserData.searchLoginTerm));
        }
        if (queryUserData.searchEmailTerm) {
            query.regex("email", new RegExp(queryUserData.searchEmailTerm))
        }

        const totalCount = await query.clone().count();

        query.sort({[sortBy]: sortDirection}).skip(skip).limit(pageSize);
        const pagesCount = Math.ceil(totalCount / pageSize);

        return {
            pagesCount: pagesCount,
            page: pageNumber,
            pageSize: pageSize,
            totalCount: totalCount,
            items: []
        }
    }
}