import {deviceSecureCollections} from "../../db/collections/deviceSecureCollections";
import {ObjectId} from "mongodb";
import {DeviceDataType} from "../../domain/auth-services";


export type SecurityDeviceActiveSessions = {
    ip: string
    title: string
    lastActiveDate: string
    deviceId: string
}

export const devicesQueryRepository = {
    async findDeviceByUserId(userId: string): Promise<SecurityDeviceActiveSessions[] | null> {
        const sessions = await deviceSecureCollections.find({userId}).toArray();

        return sessions.map(session => ({
            ip: session.ip,
            title: session.deviceName,
            lastActiveDate: session.issuedAt.toISOString(),
            deviceId: session._id.toString()
        }));
    },
    async findDeviceById(deviceId: string): Promise<DeviceDataType | null> {
        const device = await deviceSecureCollections.findOne({_id: new ObjectId(deviceId)});

        if (device) {
            return {
                id: device._id.toString(),
                userId: device.userId,
                deviceName: device.deviceName,
                ip: device.ip,
                issuedAt: device.issuedAt,
                expirationAt: device.expirationAt
            }
        } else {
            return null;
        }
    }
}