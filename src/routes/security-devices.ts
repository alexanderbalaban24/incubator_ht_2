import {Router} from "express";
import {jwtAuthRefresh} from "../middlewares/jwt-auth-refresh";
import {securityController} from "../composition-root";

export const securityDevices = Router();

securityDevices.route('/devices').get(jwtAuthRefresh, securityController.getAllDevices.bind(securityController)).delete(jwtAuthRefresh, securityController.deleteAllDevices.bind(securityController));
securityDevices.route('/devices/:deviceId').delete(jwtAuthRefresh, securityController.deleteOneDevice.bind(securityController));