import {ConfirmationDataType, UserInfoType} from "../../domain/auth-services";
import {ObjectId} from "mongodb";
import {UsersModel} from "../../db";

export const authQueryRepository = {
    async searchUserByCredentials(loginOrEmail: string): Promise<UserInfoType | null> {
        const user = await UsersModel.findOne({$or: [{login: loginOrEmail}, {email: loginOrEmail}]});

        if (user) {
            return {passwordHash: user.passwordHash, id: user._id.toString()};
        } else {
            return null;
        }
    },
    async findUserWithConfirmationDataById(userId: string): Promise<ConfirmationDataType | null> {
        const user = await UsersModel.findOne({_id: new ObjectId(userId)})

        if (user) {
            return {
                confirmationCode: user.emailConfirmation.confirmationCode,
                expirationDate: user.emailConfirmation.expirationDate,
                isConfirmed: user.emailConfirmation.isConfirmed
            }
        } else {
            return null;
        }
    },
    async findUserWithConfirmationDataByEmail(email: string): Promise<ConfirmationDataType | null> {
        const user = await UsersModel.findOne({email: email})

        if (user) {
            return {
                confirmationCode: user.emailConfirmation.confirmationCode,
                expirationDate: user.emailConfirmation.expirationDate,
                isConfirmed: user.emailConfirmation.isConfirmed
            }
        } else {
            return null;
        }
    },
    async findUserByConfirmationCode(code: string): Promise<string | null> {
        const user = await UsersModel.findOne({"emailConfirmation.confirmationCode": code});

        if (user) {
            return user._id.toString();
        } else {
            return null;
        }
    }
}