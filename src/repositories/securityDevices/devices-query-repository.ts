import {SecurityDeviceActiveSessions} from "./types";
import {DeviceModelClass} from "../../models/device/DeviceModelClass";
import {DeviceDTO} from "../../domain/dtos";


export class DevicesQueryRepository {
    async findDeviceByUserId(userId: string): Promise<SecurityDeviceActiveSessions[] | null> {
        const sessions = await DeviceModelClass.find({userId}).lean();

        return sessions.map(session => ({
            ip: session.ip,
            title: session.deviceName,
            lastActiveDate: session.issuedAt.toISOString(),
            deviceId: session._id.toString()
        }));
    }
    async findDeviceById(deviceId: string): Promise<DeviceDTO & { id: string } | null> {
        const device = await DeviceModelClass.findById(deviceId).lean();

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