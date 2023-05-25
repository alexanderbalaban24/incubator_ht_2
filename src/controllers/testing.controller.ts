import {Request, Response} from "express";
import {testingCommandRepository} from "../repositories/testing/testing-command-repository";
import {HTTPResponseStatusCodes} from "../shared/enums";

export const deleteAllData = async (req: Request, res: Response) => {
    await testingCommandRepository.deleteAllDB();
    res.sendStatus(HTTPResponseStatusCodes.NO_CONTENT);


}