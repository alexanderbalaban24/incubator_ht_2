
import {FindCursor, ObjectId, WithId} from "mongodb";
import {ViewUserModel} from "../../models/user/ViewUserModel";
import {QueryParamsUserModel} from "../../models/user/QueryParamsUserModel";
import {ViewWithQueryUserModel} from "../../models/user/ViewWithQueryUserModel";
import {UsersDB, UsersModel} from "../../db";
import {Query} from "mongoose";


export const usersQueryRepository = {
    async findUsers(query: QueryParamsUserModel): Promise<ViewWithQueryUserModel> {
        const queryUsersData = UsersModel.find({}, {projection: {passwordHash: 0}});

        const queryResult = await this._findConstructor(query, queryUsersData);

        const users = await queryUsersData.exec();
        queryResult.items = users.map(user => this._mapUserDBToViewUserModel(user));

        return queryResult;
    },
    async findUserById(userId: string): Promise<ViewUserModel | null> {
        const user = await UsersModel.findOne({_id: new ObjectId(userId)}, {projection: {passwordHash: 0}});

        if (user) {
            return this._mapUserDBToViewUserModel(user);
        } else {
            return null;
        }

    },
    _mapUserDBToViewUserModel(user: WithId<UsersDB>): ViewUserModel {
        return {
            id: user._id.toString(),
            login: user.login,
            email: user.email,
            createdAt: user.createdAt
        }
    },
    async _findConstructor(query: QueryParamsUserModel, cursor: Query<any, any>): Promise<ViewWithQueryUserModel> {
        const sortBy = query.sortBy ? query.sortBy : "createdAt";
        const sortDirection = query.sortDirection ? query.sortDirection : "desc"
        const pageNumber = query.pageNumber ? +query.pageNumber : 1
        const pageSize = query.pageSize ? +query.pageSize : 10

        const skip = pageSize * (pageNumber - 1);

        const filter = [];
        if (query.searchLoginTerm) {
            filter.push(query.searchLoginTerm);
        }
        if (query.searchEmailTerm) {
            filter.push(query.searchEmailTerm);
        }

        if (filter.length) {
            if (filter.length === 1) {
                cursor.regex("login", new RegExp(filter[0]));
            } else {
                cursor.regex("login", new RegExp(filter[0])).regex("email", new RegExp(filter[1]));
            }
        }

        const totalCount = await cursor.clone().count();

        cursor.sort({[sortBy]: sortDirection}).skip(skip).limit(pageSize);
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