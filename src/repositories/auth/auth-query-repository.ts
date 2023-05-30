import {ConfirmationDataType, UserInfoType} from "../../domain/auth-services";
import {ObjectId} from "mongodb";
import {UsersModelClass} from "../../db";

export class AuthQueryRepository {
    async searchUserByCredentials(loginOrEmail: string): Promise<UserInfoType | null> {
        const user = await UsersModelClass.findOne().or([{login: loginOrEmail}, {email: loginOrEmail}]).lean();

        if (user) {
            return {passwordHash: user.passwordHash, id: user._id.toString()};
        } else {
            return null;
        }
    }
    async findUserWithEmailConfirmationDataById(userId: string): Promise<ConfirmationDataType | null> {
        const user = await UsersModelClass.findById(userId).lean();

        if (user) {
            return {
                confirmationCode: user.emailConfirmation.confirmationCode,
                expirationDate: user.emailConfirmation.expirationDate,
                isConfirmed: user.emailConfirmation.isConfirmed
            }
        } else {
            return null;
        }
    }
    async findUserWithPasswordRecoverConfirmationDataById(userId: string): Promise<ConfirmationDataType | null> {
        const user = await UsersModelClass.findById({_id: new ObjectId(userId)}).lean();
        if (user) {
            return {
                confirmationCode: user.passwordRecover.confirmationCode,
                expirationDate: user.passwordRecover.expirationDate,
                isConfirmed: user.passwordRecover.isConfirmed
            }
        } else {
            return null;
        }
    }
    async findUserWithConfirmationDataByEmail(email: string): Promise<ConfirmationDataType | null> {
        const user = await UsersModelClass.findOne({email})

        if (user) {
            return {
                confirmationCode: user.emailConfirmation.confirmationCode,
                expirationDate: user.emailConfirmation.expirationDate,
                isConfirmed: user.emailConfirmation.isConfirmed
            }
        } else {
            return null;
        }
    }
    async findUserByConfirmationCode(code: string): Promise<string | null> {
        const user = await UsersModelClass.findOne()
            .or([{"emailConfirmation.confirmationCode": code}, {"passwordRecover.confirmationCode": code}]);

        if (user) {
            return user._id.toString();
        } else {
            return null;
        }
    }
}