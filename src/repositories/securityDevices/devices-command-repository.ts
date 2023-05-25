import {DeviceType} from "../../domain/security-services";
import {ObjectId} from "mongodb";
import {DeviceModel} from "../../db";


export const devicesCommandRepository = {
    async createDevice(newDevice: DeviceType): Promise<string> {
        const result = await new DeviceModel(newDevice).save();

        return result._id.toString();
    },
    async updateIssuedAt(deviceId: string, issuedAt: Date): Promise<boolean> {
        const result = await DeviceModel.updateOne({_id: new ObjectId(deviceId)}, {$set: { issuedAt }});

        return result.matchedCount === 1;
    },
    async deleteAllUserSessions(userId: string, exclude?: string): Promise<boolean> {
        const result = await DeviceModel.deleteMany({userId, _id: {$ne: new ObjectId(exclude)}});

        return result.deletedCount > 0;
    },
    async deleteUserSession(deviceId: string): Promise<boolean> {
        const result = await DeviceModel.deleteOne({_id: new ObjectId(deviceId)});

        return result.deletedCount === 1;
    }
}