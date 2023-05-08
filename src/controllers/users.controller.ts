import {RequestWithQueryParams} from "../shared/types";
import {QueryParamsUserModel} from "../models/user/QueryParamsUserModel";
import {ViewWithQueryUserModel} from "../models/user/ViewWithQueryUserModel";


export const getUsers = (req: RequestWithQueryParams<QueryParamsUserModel>, res: Response/*<ViewWithQueryUserModel>*/) => {
    
}