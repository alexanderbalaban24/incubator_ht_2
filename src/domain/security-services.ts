import { addMilliseconds } from 'date-fns'
import {devicesCommandRepository} from "../repositories/securityDevices/devices-command-repository";

export type DeviceType = {
    userId: string,
    deviceName: string,
    ip: string,
    issuedAt: Date,
    expirationAt: Date
}

export const securityServices = {
    async createDevice(userId: string, deviceName: string, ip: string, expiration: number): Promise<string> {
        const newDevice: DeviceType = {
            userId,
            deviceName,
            ip,
            issuedAt: new Date(),
            expirationAt: addMilliseconds(new Date(), expiration)
        }

        return await devicesCommandRepository.createDevice(newDevice);


    },
    async updateSessionTime(deviceId: string) {
        const newIssuedAt = new Date();
        return await devicesCommandRepository.updateIssuedAt(deviceId, newIssuedAt);
    },
    async revokeRefreshToken(userId: string) {
        return await devicesCommandRepository.deleteAllUserSessions(userId);
    }
}