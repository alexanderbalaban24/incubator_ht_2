import {Request, Response} from "express";
import {TestingCommandRepository} from "../repositories/testing/testing-command-repository";
import {HTTPResponseStatusCodes} from "../shared/enums";
import {inject, injectable} from "inversify";

@injectable()
export class TestingController {

    constructor(@inject(TestingCommandRepository) protected testingCommandRepository: TestingCommandRepository){}

    async deleteAllData(req: Request, res: Response) {
        await this.testingCommandRepository.deleteAllDB();
        res.sendStatus(HTTPResponseStatusCodes.NO_CONTENT);
    }
}