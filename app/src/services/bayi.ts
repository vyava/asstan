import FileSaver from "file-saver";
import { ENDPOINTS } from "src/utils/endpoints";
import {http} from "src/services/API";
import { IBayi } from "src/interfaces/bayi.interface";

interface DefaultReponse<T=unknown> {
    data: T;
    totalPages: number;
    currentPage: number
};

class BayiService {
    getBayiler = (data: any) : Promise<DefaultReponse<IBayi[]>> => http.post(ENDPOINTS.BAYILER, data)

    downloadBayiler = (data: any) => http.post(ENDPOINTS.BAYILER, {data}, {
        responseType: "blob",
    }).then(res => {
        // const url = window.URL.createObjectURL(new Blob([res], {
        //     type : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        // }));

        let blob = new Blob([(res as any)], {
            type : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });

        console.log(res);

        // FileSaver.saveAs(blob, "Test File.xlsx")

        // const link = document.createElement('a');
        // link.href = url;
        // link.setAttribute('download', `file.${data.type}`); //or any other extension
        // document.body.appendChild(link);
        // link.click();
    })
    getBayi = () => http.get(ENDPOINTS.BAYI).then(res => res);
};

export default new BayiService;