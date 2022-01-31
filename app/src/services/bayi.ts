import FileSaver from "file-saver";
import { ENDPOINTS } from "src/utils/endpoints";
import API from "src/services/API";
import { IBayi } from "src/interfaces/bayi.interface";

class BayiService extends API {
    constructor(){
        super({url : "bayiler"})
    }
    getBayiler = (params: any) : Promise<IBayi[]> => this.get(ENDPOINTS.BAYILER, params, {
        responseType: "json",
    }).then(res => res);

    downloadBayiler = (data: any) => this.post(ENDPOINTS.BAYILER, data, {
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
    getBayi = () => this.get(ENDPOINTS.BAYI).then(res => res);
};

export default new BayiService;