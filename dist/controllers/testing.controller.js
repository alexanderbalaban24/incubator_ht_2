"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAllData = void 0;
const local_db_1 = require("../db/local-db");
const deleteAllData = (req, res) => {
    local_db_1.storage.blogs.length = 0;
    local_db_1.storage.posts.length = 0;
    res.sendStatus(204);
};
exports.deleteAllData = deleteAllData;
