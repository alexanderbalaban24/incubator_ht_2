import {usersCollections, UsersDB} from "../../db/collections/usersCollections";
import {UserInfo} from "../../domain/auth-services";

export const authQueryRepository = {
    async searchUserByCredentials(loginOrEmail: string): Promise<UserInfo | null> {
        const user = await usersCollections.findOne({$or: [{login:  loginOrEmail}, {email:  loginOrEmail}]});

        if (user) {
            return {passwordHash: user.passwordHash, id: user._id.toString()};
        } else {
            return null;
        }
    }
}