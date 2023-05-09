import {RequestWithBody, ResponseEmpty} from "../shared/types";
import {LoginModel} from "../models/auth/LoginModel";
import {authServices} from "../domain/auth-services";

export const login = async (req: RequestWithBody<LoginModel>, res: ResponseEmpty) => {
    const isValidCredentials = await authServices.login(req.body.loginOrEmail, req.body.password);

    if (isValidCredentials) {
        res.sendStatus(204);
    } else {
        res.sendStatus(401);
    }
}