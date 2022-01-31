import BayiService from "src/services/bayi";

import { AxiosError } from "axios";
import { useQuery, UseQueryResult } from "react-query";
import { IBayiPoint } from "src/types/map";
import { getPositionFromCoords } from "src/components/map/map_helpers";

/**
   *
   */
const usePings = (start?: string, end?: string): UseQueryResult<IBayiPoint[], AxiosError> => {
    return useQuery<IBayiPoint[], AxiosError>(
        ['pings', { start, end }],
        async () => {
            let bayiler = await BayiService.getBayiler({});
            let pings = bayiler.map(bayi => {
                let { coords, ruhsatNo, ...rest  } = bayi;

                return {
                    type : 'Feature',
                    geometry : {
                        type : 'Point',
                        coordinates : getPositionFromCoords(coords)
                    },
                    id : ruhsatNo,
                    coords : coords,
                    properties : rest
                } as IBayiPoint
            });
            return pings
        }
    );
};

export { usePings }