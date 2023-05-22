import {Request, Response} from "express";
import {devicesQueryRepository} from "../repositories/securityDevices/devices-query-repository";
import {devicesCommandRepository} from "../repositories/securityDevices/devices-command-repository";
import {RequestWithParams, ResponseEmpty} from "../shared/types";

export const getAllDevices = async (req: Request, res: Response) => {
    const activeSessions = await devicesQueryRepository.findDeviceByUserId(req.userId!);

    if (activeSessions) {
        res.status(200).json(activeSessions);
    } else {
        res.sendStatus(404);
    }
}

export const deleteAllDevices = async (req: Request, res: ResponseEmpty) => {
    const isDeleted = await devicesCommandRepository.deleteAllUserSessions(req.userId!);

    if (isDeleted) {
        res.sendStatus(204);
    } else {
        res.sendStatus(404);
    }
}

export const deleteOneDevice = async (req: RequestWithParams<{ deviceId: string }>, res: ResponseEmpty) => {
    const deviceInfo = await devicesQueryRepository.findDeviceById(req.params.deviceId);
    if(!deviceInfo) {
        res.sendStatus(404);
        return;
    }

    if(deviceInfo.userId !== req.userId) {
        res.sendStatus(403);
    }

    const isDeleted = await devicesCommandRepository.deleteUserSession(req.params.deviceId)

        if (isDeleted) {
            res.sendStatus(204);
        } else {
            res.sendStatus(404);
        }
}