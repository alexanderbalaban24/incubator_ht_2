import {UsersModelClass} from "../../models/database/UsersModelClass";
import {RecoveryPasswordDTO} from "../../domain/dtos";
import {ResultDTO} from "../../shared/dto";
import {InternalCode} from "../../shared/enums";
import {injectable} from "inversify";

@injectable()
export class AuthCommandRepository {
    async updateIsConfirmedEmailConfirmationFieldById(userId: string): Promise<ResultDTO<{ isUpdated: boolean }>> {
        const userInstances = await UsersModelClass.findById(userId);
        if (!userInstances) return new ResultDTO(InternalCode.Not_Found);

        userInstances.emailConfirmation.isConfirmed = true;


        await userInstances.save();
        return new ResultDTO(InternalCode.Success, {isUpdated: true});
    }

    async updateConfirmationDataByEmail(email: string, confirmationCode: string, expirationDate: Date): Promise<ResultDTO<{
        isUpdated: boolean
    }>> {
        const userInstances = await UsersModelClass.findOne({email});
        if (!userInstances) return new ResultDTO(InternalCode.Not_Found);

        userInstances.emailConfirmation.expirationDate = expirationDate;
        userInstances.emailConfirmation.confirmationCode = confirmationCode;

        await userInstances.save();
        return new ResultDTO(InternalCode.Success, {isUpdated: true});
    }

    async updateRecoveryData(userId: string, newRecoveryData: RecoveryPasswordDTO): Promise<ResultDTO<{
        confirmationCode: string
    }>> {
        const userInstances = await UsersModelClass.findById(userId);
        if (!userInstances) return new ResultDTO(InternalCode.Not_Found);

        userInstances.passwordRecover.confirmationCode = newRecoveryData.confirmationCode;
        userInstances.passwordRecover.expirationDate = newRecoveryData.expirationDate;
        userInstances.passwordRecover.isConfirmed = newRecoveryData.isConfirmed;

        await userInstances.save();
        return new ResultDTO(InternalCode.Success, {confirmationCode: userInstances.passwordRecover.confirmationCode});
    }

    async updateIsConfirmedPasswordConfirmationAndPasswordHashById(userId: string, newPasswordHash: string): Promise<ResultDTO<{
        isUpdated: boolean
    }>> {
        const userInstances = await UsersModelClass.findById(userId);
        if (!userInstances) return new ResultDTO(InternalCode.Not_Found);

        userInstances.emailConfirmation.isConfirmed = true;
        userInstances.passwordHash = newPasswordHash;

        await userInstances.save();
        return new ResultDTO(InternalCode.Success, {isUpdated: true})
    }
}