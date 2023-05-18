import {Router} from "express";

export const securityDevices = Router();

securityDevices.route('/devices').get().delete()