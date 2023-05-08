import {Request, Response} from "express";
import {testingCommandRepository} from "../repositories/testing/testing-command-repository";

export const deleteAllData = async (req: Request, res: Response) => {
    await testingCommandRepository.deleteAllDB();
    res.sendStatus(204);


}