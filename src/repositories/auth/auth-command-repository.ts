import {ObjectId} from "mongodb";
import {UsersModel} from "../../db";

export const authCommandRepository = {
    async updateIsConfirmedFieldById(userId: string): Promise<boolean> {
        const result = await UsersModel.updateOne({_id: new ObjectId(userId)}, {$set: {"emailConfirmation.isConfirmed": true}});

        return result.matchedCount === 1;
    },
    async updateConfirmationDataByEmail(email: string, confirmationCode: string, expirationDate: string) {
        const result = await UsersModel.updateOne({email: email}, {$set: {"emailConfirmation.expirationDate": expirationDate, "emailConfirmation.confirmationCode": confirmationCode}});

        return result.matchedCount === 1;
    }
}