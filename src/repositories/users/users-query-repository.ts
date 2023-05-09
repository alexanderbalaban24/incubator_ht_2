import {usersCollections, UsersDB} from "../../db/collections/usersCollections";
import {FindCursor, ObjectId, WithId} from "mongodb";
import {ViewUserModel} from "../../models/user/ViewUserModel";
import {QueryParamsUserModel} from "../../models/user/QueryParamsUserModel";
import {ViewWithQueryUserModel} from "../../models/user/ViewWithQueryUserModel";


export const usersQueryRepository = {
    async findUsers(query: QueryParamsUserModel): Promise<ViewWithQueryUserModel> {
        const cursor = usersCollections.find({}, {projection: {passwordHash: 0}});

        const queryResult = await this._findConstructor(query, cursor);

        const users = await cursor.toArray();
        queryResult.items = users.map(user => this._mapUserDBToViewUserModel(user));

        return queryResult;
    },
    async findUserById(userId: string): Promise<ViewUserModel | null> {
        const user = await usersCollections.findOne({_id: new ObjectId(userId)}, {projection: {passwordHash: 0}});

        if (user) {
            return this._mapUserDBToViewUserModel(user);
        } else {
            return null;
        }

    },
    _mapUserDBToViewUserModel(user: UsersDB): ViewUserModel {
        return {
            id: user._id.toString(),
            login: user.login,
            email: user.email,
            createdAt: user.createdAt
        }
    },
    async _findConstructor(query: QueryParamsUserModel, cursor: FindCursor): Promise<ViewWithQueryUserModel> {
        const sortBy = query.sortBy ? query.sortBy : "createdAt";
        const sortDirection = query.sortDirection ? query.sortDirection : "desc"
        const pageNumber = query.pageNumber ? +query.pageNumber : 1
        const pageSize = query.pageSize ? +query.pageSize : 10

        const skip = pageSize * (pageNumber - 1);

        const filter = [];
        if (query.searchLoginTerm) {
            filter.push({login: {$regex: query.searchLoginTerm, $options: 'i'}});
        }
        if (query.searchEmailTerm) {
            filter.push({email: {$regex: query.searchEmailTerm, $options: 'i'}});
        }

        if (filter.length) {
            if (filter.length === 1) {
                cursor.filter(filter[0]);
            } else {
                cursor.filter({$or: filter});
            }
        }

        const totalCount = await cursor.count();

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