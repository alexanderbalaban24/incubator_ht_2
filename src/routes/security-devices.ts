import {Router} from "express";
import {jwtAuthRefresh} from "../middlewares/jwt-auth-refresh";
import {container} from "../inversify.config";
import {SecurityController} from "../controllers/security.controller";

export const securityDevices = Router();

const securityController = container.resolve(SecurityController);

securityDevices.route('/devices')
    .get(jwtAuthRefresh, securityController.getAllDevices.bind(securityController))
    .delete(jwtAuthRefresh, securityController.deleteAllDevices.bind(securityController));

securityDevices.route('/devices/:deviceId')
    .delete(jwtAuthRefresh, securityController.deleteOneDevice.bind(securityController));