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
const dotenv_1 = require("dotenv");
const app_1 = require("./app");
const db_1 = require("./db");
(0, dotenv_1.config)();
const PORT = process.env.PORT;
const startApp = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, db_1.runDB)();
        app_1.app.listen(PORT, () => {
            console.log(`Server running on port : ${PORT}`);
        });
    }
    catch (e) {
        console.log(e);
    }
});
startApp();
