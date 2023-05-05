import {Request, Response} from "express";
import {testingRepository} from "../repositories/testing-repository";

export const deleteAllData = async (req: Request, res: Response) => {
    await testingRepository.deleteAllDB();
    res.sendStatus(204);


}