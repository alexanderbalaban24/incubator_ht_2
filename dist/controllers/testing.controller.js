"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAllData = void 0;
const testing_command_repository_1 = require("../repositories/testing/testing-command-repository");
const deleteAllData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield testing_command_repository_1.testingCommandRepository.deleteAllDB();
    res.sendStatus(204);
});
exports.deleteAllData = deleteAllData;
