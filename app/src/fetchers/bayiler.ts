import { AxiosError } from "axios";
import { useQuery, UseQueryOptions, UseQueryResult } from "react-query";
import { IBayi } from "src/interfaces/bayi.interface";
import BayiService from "src/services/bayi";

const defaultQueryOptions: Pick<UseQueryOptions, 'refetchOnWindowFocus'> = { refetchOnWindowFocus: false };

export const bayiFetcher = async ({queryKey} : any) => {
    const [key, query] = queryKey;
    if(key == "bayilerExcel"){
        return BayiService.downloadBayiler(query);
    }else if(key == 'bayilerJson'){
        return BayiService.getBayiler(query);
    }
};

export const useBayiler = (): UseQueryResult<IBayi[], AxiosError>  => {
    return useQuery<IBayi[], AxiosError>(
        ['bayiler'],
        () => BayiService.getBayiler({}),
        defaultQueryOptions
    );
}