import {usersCollections, UsersDB} from "../../db/collections/usersCollections";

export const authQueryRepository = {
    async searchUserByCredentials(loginOrEmail: string): Promise<string | null> {
        const user = await usersCollections.findOne({$or: [{login:  loginOrEmail}, {email:  loginOrEmail}]});

        if (user) {
            return user.passwordHash;
        } else {
            return null;
        }
    }
}