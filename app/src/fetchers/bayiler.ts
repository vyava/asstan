import { useContext } from "react";
import { useQuery, UseQueryResult } from "react-query";
import { IBayi } from "@shared/interfaces";
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