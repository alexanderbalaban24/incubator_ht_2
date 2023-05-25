import {Router} from "express";
import {jwtAuthRefresh} from "../middlewares/jwt-auth-refresh";
import {deleteAllDevices, deleteOneDevice, getAllDevices} from "../controllers/security.controller";

export const securityDevices = Router();

securityDevices.route('/devices').get(jwtAuthRefresh, getAllDevices).delete(jwtAuthRefresh, deleteAllDevices);
securityDevices.route('/devices/:deviceId').delete(jwtAuthRefresh, deleteOneDevice);