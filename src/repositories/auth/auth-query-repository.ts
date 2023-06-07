import {ConfirmationDataType, UserInfoType} from "../../domain/types";
import {UsersModelClass} from "../../models/database/UsersModelClass";
import {ResultDTO} from "../../shared/dto";
import {InternalCode} from "../../shared/enums";

export class AuthQueryRepository {
    async searchUserByCredentials(loginOrEmail: string): Promise<ResultDTO<UserInfoType>> {
        const test = await UsersModelClass.find({}).lean()
        const user = await UsersModelClass.findOne().or([{login: loginOrEmail}, {email: loginOrEmail}]).lean();
        if (user) {
            return new ResultDTO(InternalCode.Success, {passwordHash: user.passwordHash, id: user._id.toString()});
        } else {
            return new ResultDTO(InternalCode.Not_Found);
        }
    }
    async findUserWithEmailConfirmationDataById(userId: string): Promise<ResultDTO<ConfirmationDataType>> {
        const user = await UsersModelClass.findById(userId).lean();

        if (user) {
            return new ResultDTO(InternalCode.Success, {
                confirmationCode: user.emailConfirmation.confirmationCode,
                expirationDate: user.emailConfirmation.expirationDate,
                isConfirmed: user.emailConfirmation.isConfirmed
            });
        } else {
            return new ResultDTO(InternalCode.Not_Found);
        }
    }
    async findUserWithPasswordRecoverConfirmationDataById(userId: string): Promise<ResultDTO<ConfirmationDataType>> {
        const user = await UsersModelClass.findById(userId).lean();
        if (user) {
            return new ResultDTO(InternalCode.Success, {
                confirmationCode: user.passwordRecover.confirmationCode,
                expirationDate: user.passwordRecover.expirationDate,
                isConfirmed: user.passwordRecover.isConfirmed
            });
        } else {
            return new ResultDTO(InternalCode.Not_Found);
        }
    }
    async findUserWithConfirmationDataByEmail(email: string): Promise<ResultDTO<ConfirmationDataType>> {
        const user = await UsersModelClass.findOne({email})

        if (user) {
            return new ResultDTO(InternalCode.Success, {
                confirmationCode: user.emailConfirmation.confirmationCode,
                expirationDate: user.emailConfirmation.expirationDate,
                isConfirmed: user.emailConfirmation.isConfirmed
            })
        } else {
            return new ResultDTO(InternalCode.Not_Found);
        }
    }
    async findUserByConfirmationCode(code: string): Promise<ResultDTO<{ id: string }>> {
        const user = await UsersModelClass.findOne()
            .or([{"emailConfirmation.confirmationCode": code}, {"passwordRecover.confirmationCode": code}]);

        if (user) {
            return new ResultDTO(InternalCode.Success, { id: user._id.toString() });
        } else {
            return new ResultDTO(InternalCode.Not_Found);
        }
    }
}