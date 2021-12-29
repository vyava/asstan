import BayiService from "src/services/bayi";

export const bayiFetcher = async ({queryKey} : any) => {
    const [key, query] = queryKey;
    if(key == "bayilerExcel"){
        return BayiService.downloadBayiler(query);
    }else if(key == 'bayilerJson'){
        return BayiService.getBayiler(query);
    }
}