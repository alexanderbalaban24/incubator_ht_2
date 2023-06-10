import {Router} from "express";
import {container} from "../inversify.config";
import {TestingController} from "../controllers/testing.controller";

export const testingRouter = Router();

const testingController = container.resolve(TestingController);

testingRouter.route('/all-data').delete(testingController.deleteAllData.bind(testingController));