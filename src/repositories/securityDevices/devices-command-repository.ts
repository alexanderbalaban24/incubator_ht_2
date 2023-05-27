import {DeviceType} from "../../domain/security-services";
import {ObjectId} from "mongodb";
import {DeviceModelClass} from "../../db";


export const devicesCommandRepository = {
    async createDevice(newDevice: DeviceType): Promise<string> {
        const result = await new DeviceModelClass(newDevice).save();
        return result._id.toString();
    },
    async updateIssuedAt(deviceId: string, issuedAt: Date): Promise<boolean> {
        const deviceInstances = await DeviceModelClass.findById(deviceId);
        if (!deviceInstances) return false;

        deviceInstances.issuedAt = issuedAt;

        try {
            await deviceInstances.save();
            return true;
        } catch (e) {
            return false;
        }
    },
    async deleteAllUserSessions(userId: string, exclude?: string): Promise<boolean> {
        const result = await DeviceModelClass.deleteMany({userId, _id: {$ne: new ObjectId(exclude)}});

        return result.deletedCount > 0;
    },
    async deleteUserSession(deviceId: string): Promise<boolean> {
        const deviceInstances = await DeviceModelClass.findById(deviceId);
        if (!deviceInstances) return false;

        try {
            const result = await deviceInstances.deleteOne();
            return result.$isDeleted();
        } catch (e) {
            return false;
        }
    }
}