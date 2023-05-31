import {jwtServices} from "../application/jwt-services";
import {DevicesCommandRepository} from "../repositories/securityDevices/devices-command-repository";
import {DeviceDTO} from "./dtos";

export class SecurityServices {

    constructor(protected devicesCommandRepository: DevicesCommandRepository) {
    }

    async createDevice(userId: string, deviceName: string, ip: string, expiration: number): Promise<string> {
        const newDevice = new DeviceDTO(
            userId,
            deviceName,
            ip,
            expiration
        )

        const deviceId = await this.devicesCommandRepository.createDevice(newDevice);
        return jwtServices.createRefreshToken(userId, deviceId);

    }

    async updateSessionTime(deviceId: string): Promise<boolean> {
        const newIssuedAt = new Date();
        return await this.devicesCommandRepository.updateIssuedAt(deviceId, newIssuedAt);
    }

    async revokeRefreshToken(userId: string): Promise<boolean> {
        return await this.devicesCommandRepository.deleteUserSession(userId);
    }

    async deleteAllUserSessions(userId: string, refreshToken: string): Promise<boolean> {
        const refreshInfo = jwtServices.decodeToken(refreshToken);
        if (!refreshInfo) return false;

        return await this.devicesCommandRepository.deleteAllUserSessions(userId, refreshInfo.deviceId);
    }
}