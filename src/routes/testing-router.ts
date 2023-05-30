import {Router} from "express";
import {testingController} from "../composition-root";

export const testingRouter = Router();

testingRouter.route('/all-data').delete(testingController.deleteAllData.bind(testingController));