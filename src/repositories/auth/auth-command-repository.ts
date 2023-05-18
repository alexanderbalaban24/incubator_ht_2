import {usersCollections} from "../../db/collections/usersCollections";
import {ObjectId} from "mongodb";

export const authCommandRepository = {
    async updateIsConfirmedFieldById(userId: string): Promise<boolean> {
        const result = await usersCollections.updateOne({_id: new ObjectId(userId)}, {$set: {"emailConfirmation.isConfirmed": true}});

        return result.matchedCount === 1;
    },
    async updateConfirmationDataByEmail(email: string, confirmationCode: string, expirationDate: string) {
        const result = await usersCollections.updateOne({email: email}, {$set: {"emailConfirmation.expirationDate": expirationDate, "emailConfirmation.confirmationCode": confirmationCode}});

        return result.matchedCount === 1;
    }
}