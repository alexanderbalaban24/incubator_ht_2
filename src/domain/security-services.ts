import {jwtServices} from "../application/jwt-services";
import {DevicesCommandRepository} from "../repositories/securityDevices/devices-command-repository";
import {DeviceDTO} from "./dtos";
import {ResultDTO} from "../shared/dto";
import {InternalCode} from "../shared/enums";
import {inject, injectable} from "inversify";

@injectable()
export class SecurityServices {

    constructor(@inject(DevicesCommandRepository) protected devicesCommandRepository: DevicesCommandRepository) {}

    async createDevice(userId: string, deviceName: string, ip: string, expiration: number): Promise<ResultDTO<{
        refreshToken: string
    }>> {
        const newDevice = new DeviceDTO(
            userId,
            deviceName,
            ip,
            expiration
        )

        const deviceResult = await this.devicesCommandRepository.createDevice(newDevice);
        if (deviceResult.success) {
            const refreshTokenResult = jwtServices.createRefreshToken(userId, deviceResult.payload!.id);
            if (refreshTokenResult.success) {
                return new ResultDTO(InternalCode.Created, {refreshToken: refreshTokenResult.payload!.refreshToken});
            } else {
                return new ResultDTO(refreshTokenResult.code);
            }

        } else {
            return new ResultDTO(deviceResult.code);
        }

    }

    async updateSessionTime(deviceId: string): Promise<ResultDTO<{ isUpdated: boolean }>> {
        const newIssuedAt = new Date();
        const updatedResult = await this.devicesCommandRepository.updateIssuedAt(deviceId, newIssuedAt);
        if(!updatedResult.success) return new ResultDTO(InternalCode.Not_Found);

        return new ResultDTO(InternalCode.Success, {isUpdated: true})
    }

    async revokeRefreshToken(userId: string): Promise<ResultDTO<{ isRevoked: boolean }>> {
        const revokeResult = await this.devicesCommandRepository.deleteUserSession(userId);
        if (!revokeResult.success) return new ResultDTO(InternalCode.Unathorized);

        return new ResultDTO(InternalCode.No_Content, { isRevoked: true });
    }

    async deleteAllUserSessions(userId: string, refreshToken: string): Promise<ResultDTO<{ isDeleted: boolean }>> {
        const refreshInfoResult = jwtServices.decodeToken(refreshToken);
        if (!refreshInfoResult.success) return new ResultDTO(refreshInfoResult.code);

        const deleteResult = await this.devicesCommandRepository.deleteAllUserSessions(userId, refreshInfoResult.payload!.deviceId);
        if(!deleteResult.success) return new ResultDTO(InternalCode.Not_Found);

        return new ResultDTO(InternalCode.No_Content, { isDeleted: true })
    }
}