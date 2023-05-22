import {deviceSecureCollections} from "../../db/collections/deviceSecureCollections";
import {DeviceType} from "../../domain/security-services";
import {ObjectId} from "mongodb";


export const devicesCommandRepository = {
    async createDevice(newDevice: DeviceType): Promise<string> {
        const result = await deviceSecureCollections.insertOne(newDevice);

        return result.insertedId.toString();
    },
    async updateIssuedAt(deviceId: string, issuedAt: Date): Promise<boolean> {
        const result = await deviceSecureCollections.updateOne({_id: new ObjectId(deviceId)}, {$set: { issuedAt }});

        return result.matchedCount === 1;
    },
    async deleteAllUserSessions(userId: string): Promise<boolean> {
        const result = await deviceSecureCollections.deleteMany({userId});

        return result.deletedCount > 0;
    },
    async deleteUserSession(deviceId: string): Promise<boolean> {
        const result = await deviceSecureCollections.deleteOne({_id: new ObjectId(deviceId)});

        return result.deletedCount === 1;
    }
}