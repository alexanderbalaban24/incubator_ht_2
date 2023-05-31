import {UsersModelClass} from "../../models/user/UsersModelClass";
import {RecoveryPasswordDTO} from "../../domain/dtos";

export class AuthCommandRepository {
    async updateIsConfirmedEmailConfirmationFieldById(userId: string): Promise<boolean> {
        const userInstances = await UsersModelClass.findById(userId);
        if (!userInstances) return false;

        userInstances.emailConfirmation.isConfirmed = true;

        try {
            await userInstances.save();
            return true;
        } catch (e) {
            return false;
        }
    }
    async updateConfirmationDataByEmail(email: string, confirmationCode: string, expirationDate: Date): Promise<boolean> {
        const userInstances = await UsersModelClass.findOne({email});
        if (!userInstances) return false;

        userInstances.emailConfirmation.expirationDate = expirationDate;
        userInstances.emailConfirmation.confirmationCode = confirmationCode;

        try {
            await userInstances.save();
            return true;
        } catch (e) {
            return false;
        }
    }
    async updateRecoveryData(userId: string, newRecoveryData: RecoveryPasswordDTO): Promise<string | null> {
        const userInstances = await UsersModelClass.findById(userId);
        if(!userInstances) return null;

        userInstances.passwordRecover.confirmationCode = newRecoveryData.confirmationCode;
        userInstances.passwordRecover.expirationDate = newRecoveryData.expirationDate;
        userInstances.passwordRecover.isConfirmed = newRecoveryData.isConfirmed;

        try {
            await userInstances.save();
            return userInstances.passwordRecover.confirmationCode;
        } catch (e) {
            return null;
        }
    }
    async updateIsConfirmedPasswordConfirmationAndPasswordHashById(userId: string, newPasswordHash: string): Promise<boolean> {
        const userInstances = await UsersModelClass.findById(userId);
        if (!userInstances) return false;

        userInstances.emailConfirmation.isConfirmed = true;
        userInstances.passwordHash = newPasswordHash;

        try {
            await userInstances.save();
            return true;
        } catch (e) {
            return false;
        }
    }
}