import {ObjectId} from "mongodb";
import {UsersModelClass} from "../../db";

export const authCommandRepository = {
    async updateIsConfirmedFieldById(userId: string): Promise<boolean> {
        const userInstances = await UsersModelClass.findById(userId);
        if (!userInstances) return false;

        userInstances.emailConfirmation.isConfirmed = true;

        try {
            await userInstances.save();
            return true;
        } catch (e) {
            return false;
        }
    },
    async updateConfirmationDataByEmail(email: string, confirmationCode: string, expirationDate: string) {
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
}