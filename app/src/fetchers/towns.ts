import TownsService from "src/services/town";

import { AxiosError } from "axios";
import { useQuery, UseQueryResult } from "react-query";
import { ITownLine, ITownQuery } from "src/types/map";


/**
   *
   */
const useTowns = ( query : ITownQuery | ITownQuery[], options): UseQueryResult<ITownLine[], AxiosError> => {
    
    let townQuery = [].concat(query) as ITownQuery[];

    return useQuery<ITownLine[], AxiosError>(
        ['towns', townQuery],
        async () => {
            let towns = await TownsService.getTowns(townQuery);
            if(!!towns && towns.length > 0) {
                let townPolygons = towns.map(town => {
                    let { _id, geolocation : { polygons, lat, lng }, ...rest  } = town;
    
                    return {
                        type: 'Feature',
                        geometry: {
                            type : 'Polygon',
                            coordinates : polygons
                        },
                        id: _id,
                        properties: {lat, lng, ...rest}
                    } as ITownLine
                });
                return townPolygons
            }else{
                console.log("towns yok")
            }
        },
        options
    );
};

export { useTowns }