import { ENDPOINTS } from "src/utils/endpoints";
import API from "src/services/API";
import { ITown } from "src/interfaces/town.interface";
import { ITownQuery } from "src/types/map";

class TownService extends API {
    constructor(){
        super({url : "town"})
    }
    getTowns = (params: ITownQuery[]) : Promise<ITown[]> => this.post<ITownQuery[], ITown[]>(ENDPOINTS.TOWNS, params, {
        responseType: "json",
    }).then(res => res);
};

export default new TownService;