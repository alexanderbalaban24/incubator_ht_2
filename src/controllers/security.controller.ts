import {Request, Response} from "express";
import {RequestWithParams, ResponseEmpty} from "../shared/types";
import {HTTPResponseStatusCodes} from "../shared/enums";
import {SecurityServices} from "../domain/security-services";
import {DevicesCommandRepository} from "../repositories/securityDevices/devices-command-repository";
import {DevicesQueryRepository} from "../repositories/securityDevices/devices-query-repository";
import {mapStatusCode} from "../shared/utils";

export class SecurityController {

    constructor(
        protected securityServices: SecurityServices,
        protected devicesCommandRepository: DevicesCommandRepository,
        protected devicesQueryRepository: DevicesQueryRepository
    ) {
    }

    async getAllDevices(req: Request, res: Response) {
        const activeSessionsResult = await this.devicesQueryRepository.findDeviceByUserId(req.userId!);

        if (activeSessionsResult.success && activeSessionsResult.payload!.sessions.length) {
            res.status(mapStatusCode(activeSessionsResult.code)).json(activeSessionsResult.payload!.sessions);
        } else {
            res.sendStatus(mapStatusCode(activeSessionsResult.code));
        }
    }

    async deleteAllDevices(req: Request, res: ResponseEmpty) {
        const deletedResult = await this.securityServices.deleteAllUserSessions(req.userId!, req.cookies.refreshToken);

        res.sendStatus(mapStatusCode(deletedResult.code));
    }

    async deleteOneDevice(req: RequestWithParams<{ deviceId: string }>, res: ResponseEmpty) {
        const deviceInfoResult = await this.devicesQueryRepository.findDeviceById(req.params.deviceId);
        if (!deviceInfoResult.success) return res.sendStatus(mapStatusCode(deviceInfoResult.code));

        if (deviceInfoResult.payload!.userId !== req.userId) {
            res.sendStatus(HTTPResponseStatusCodes.FORBIDDEN);
            return;
        }

        const deletedResult = await this.devicesCommandRepository.deleteUserSession(req.params.deviceId)

        res.sendStatus(mapStatusCode(deletedResult.code));
    }
}