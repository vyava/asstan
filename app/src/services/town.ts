import { ENDPOINTS } from "src/utils/endpoints";
import { http } from "src/services/API";
import { ITown } from "@shared/interfaces";
import { ITownQuery } from "src/types/map";

class TownService {
    getTowns = (params: ITownQuery[]) : Promise<ITown[]> => http.post<ITownQuery[], ITown[]>(ENDPOINTS.TOWNS, params, {
        responseType: "json",
    }).then(res => res);
};

export default new TownService;