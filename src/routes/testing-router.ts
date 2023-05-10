import {Router} from "express";
import {deleteAllData} from "../controllers/testing.controller";

export const testingRouter = Router();

testingRouter.route('/all-data').delete(deleteAllData);