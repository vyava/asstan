import { Mail, IUserMail } from "./user.interface";
import { IBayi } from "@shared/interfaces";

export interface IMailPayload {
    file : any;
    from? : Mail[];
    to : Mail[];
    cc : Mail[];
    subject : string;
    text? : string;
    html? : string;
    attachments : IAttachment[] | IAttachment;
    sendAt? : number;
}

export interface IAttachment {
    content: any;
    filename: string;
    type?: string;
    disposition?: string;
    content_id?: string;
};

export interface IBolgeMailData {
    _id?     : string;
    bayiler : [IBayi];
    users   : [IUserMail];
    distName? : String;
    data?    : any;
}