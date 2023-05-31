import {app} from "./app";
import {settings} from "./shared/settings";
import {startDB} from "./db";

const PORT = settings.port;

const startApp = async () => {
    try {
        await startDB();
        app.listen(PORT, () => {
            console.log(`Server running on port : ${PORT}`);
        });
    } catch (e) {
        console.log(e);
    }
}

startApp();