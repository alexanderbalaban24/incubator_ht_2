import {Request, Response} from "express";
import {RequestEmpty, RequestWithParams, ResponseEmpty} from "../shared/types";
import {HTTPResponseStatusCodes} from "../shared/enums";
import {SecurityServices} from "../domain/security-services";
import {DevicesCommandRepository} from "../repositories/securityDevices/devices-command-repository";
import {DevicesQueryRepository} from "../repositories/securityDevices/devices-query-repository";
import {mapStatusCode} from "../shared/utils";
import {sendResponse} from "../shared/helpers";
import {SecurityDeviceActiveSessions} from "../repositories/securityDevices/types";

export class SecurityController {

    constructor(
        protected securityServices: SecurityServices,
        protected devicesCommandRepository: DevicesCommandRepository,
        protected devicesQueryRepository: DevicesQueryRepository
    ) {
    }

    async getAllDevices(req: RequestEmpty, res: Response<SecurityDeviceActiveSessions[]>) {
        const activeSessionsResult = await this.devicesQueryRepository.findDeviceByUserId(req.userId!);

        sendResponse<SecurityDeviceActiveSessions[]>(res, activeSessionsResult);
    }

    async deleteAllDevices(req: RequestEmpty, res: ResponseEmpty) {
        const deletedResult = await this.securityServices.deleteAllUserSessions(req.userId!, req.cookies.refreshToken);

        sendResponse(res, deletedResult);
    }

    async deleteOneDevice(req: RequestWithParams<{ deviceId: string }>, res: ResponseEmpty) {
        const deviceInfoResult = await this.devicesQueryRepository.findDeviceById(req.params.deviceId);
        if (!deviceInfoResult.success) return res.sendStatus(mapStatusCode(deviceInfoResult.code));

        if (deviceInfoResult.payload!.userId !== req.userId) {
            res.sendStatus(HTTPResponseStatusCodes.FORBIDDEN);
            return;
        }

        const deletedResult = await this.devicesCommandRepository.deleteUserSession(req.params.deviceId)

        sendResponse(res, deletedResult);
    }
}