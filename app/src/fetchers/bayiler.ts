import { AxiosError } from "axios";
import { useQuery, UseQueryOptions, UseQueryResult } from "react-query";
import { IBayi } from "src/interfaces/bayi.interface";
import BayiService from "src/services/bayi";

const defaultQueryOptions: Pick<UseQueryOptions, 'refetchOnWindowFocus'> = { refetchOnWindowFocus: false };

export const bayiFetcher = async ({queryKey} : any) => {
    const [key, query] = queryKey;
    return BayiService.getBayiler(query);
};

export const bayiDownloadFetcher = async ({queryKey} : any) => {
    const [key, query] = queryKey;
    return BayiService.downloadBayiler(query);
};

export const useBayiler = () => {
    return useQuery(
        ['bayiler'],
        () => BayiService.getBayiler({}),
        defaultQueryOptions
    );
}