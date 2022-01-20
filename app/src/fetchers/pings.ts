import BayiService from "src/services/bayi";

import { AxiosError } from "axios";
import { useQuery, UseQueryResult } from "react-query";
import { ITelemetryPoint } from "src/types/map";

/**
   *
   */
const usePings = (start?: string, end?: string): UseQueryResult<ITelemetryPoint[], AxiosError> => {
    return useQuery<ITelemetryPoint[], AxiosError>(
        ['pings', { start, end }],
        () => BayiService.getBayiler({}),
        // defaultQueryOptions
    );
};

export { usePings }