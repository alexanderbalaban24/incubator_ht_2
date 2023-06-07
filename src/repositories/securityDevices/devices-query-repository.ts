import {SecurityDeviceActiveSessions} from "./types";
import {DeviceModelClass} from "../../models/database/DeviceModelClass";
import {DeviceDTO} from "../../domain/dtos";
import {ResultDTO} from "../../shared/dto";
import {InternalCode} from "../../shared/enums";


export class DevicesQueryRepository {
    async findDeviceByUserId(userId: string): Promise<ResultDTO<SecurityDeviceActiveSessions[]>> {
        const sessions = await DeviceModelClass.find({userId}).lean();

        const mappedSessions = sessions.map(session => ({
            ip: session.ip,
            title: session.deviceName,
            lastActiveDate: session.issuedAt.toISOString(),
            deviceId: session._id.toString()
        }));

        return new ResultDTO(InternalCode.Success, mappedSessions);
    }
    async findDeviceById(deviceId: string): Promise<ResultDTO<DeviceDTO & { id: string }>> {
        const device = await DeviceModelClass.findById(deviceId).lean();

        if (device) {
            const deviceInfo = {
                id: device._id.toString(),
                userId: device.userId,
                deviceName: device.deviceName,
                ip: device.ip,
                issuedAt: device.issuedAt,
                expirationAt: device.expirationAt
            }

            return new ResultDTO(InternalCode.Success, deviceInfo);
        } else {
            return new ResultDTO(InternalCode.Not_Found);
        }
    }
}