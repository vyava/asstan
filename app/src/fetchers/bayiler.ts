import { useContext } from "react";
import { useQuery, UseQueryResult } from "react-query";
import { IBayi } from "src/interfaces/bayi.interface";
import BayiService from "src/services/bayi";
import { mapContext } from "src/contexts/map.context";
import { AxiosError } from "axios";

export const bayiFetcher = async ({ queryKey }: any) => {
    const [key, query] = queryKey;
    return BayiService.getBayiler(query);
};

export const bayiDownloadFetcher = async ({ queryKey }: any) => {
    const [key, query] = queryKey;
    return BayiService.downloadBayiler(query);
};

export const useBayiler = () : UseQueryResult<IBayi[], AxiosError> => {
    const { isStale, setIsStale, filters } = useContext(mapContext);

    return useQuery(["bayiler", filters], bayiFetcher, {
        initialData: null,
        refetchOnWindowFocus: false,
        select: res => res?.data,
        enabled : !isStale,
        onSettled : () => setIsStale(true)
    });
}