import BayiService from "src/services/bayi";

import { AxiosError } from "axios";
import { useQuery, UseQueryResult } from "react-query";
import { IBayiPoint } from "src/types/map";
import { getPositionFromCoords } from "src/components/map/map_helpers";

/**
   *
   */
const usePings = (data): IBayiPoint[] => {
    let pings = data?.map(bayi => {
        let { coords, ruhsatNo, ...rest } = bayi;

        return {
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: getPositionFromCoords(coords) || []
            },
            id: ruhsatNo,
            coords: coords,
            properties: rest
        }
    });
    return pings
};

export { usePings }