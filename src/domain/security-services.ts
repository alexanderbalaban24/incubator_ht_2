import { addMilliseconds } from 'date-fns'
import {devicesCommandRepository} from "../repositories/securityDevices/devices-command-repository";
import {jwtServices} from "../application/jwt-services";

export type DeviceType = {
    userId: string,
    deviceName: string,
    ip: string,
    issuedAt: Date,
    expirationAt: Date
}

export const securityServices = {
    async createDevice(userId: string, deviceName: string, ip: string, expiration: number): Promise<string> {
        console.log("Native date", new Date())
        const newDevice: DeviceType = {
            userId,
            deviceName,
            ip,
            issuedAt: new Date(),
            expirationAt: addMilliseconds(new Date(), expiration)
        }

        const deviceId =  await devicesCommandRepository.createDevice(newDevice);
        return jwtServices.createRefreshToken(userId, deviceId);

    },
    async updateSessionTime(deviceId: string): Promise<boolean> {
        const newIssuedAt = new Date();
        return await devicesCommandRepository.updateIssuedAt(deviceId, newIssuedAt);
    },
    async revokeRefreshToken(userId: string): Promise<boolean> {
        return await devicesCommandRepository.deleteUserSession(userId);
    },
    async deleteAllUserSessions(userId: string, refreshToken: string): Promise<boolean> {
        const refreshInfo = jwtServices.decodeToken(refreshToken);
        if (!refreshInfo) return false;

        return await devicesCommandRepository.deleteAllUserSessions(userId, refreshInfo.deviceId);
    }
}