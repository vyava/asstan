import { Document, Types } from "mongoose";
import { IDistrict } from "../models";
// import { IBolge } from "./bolge.interface";
import { IUser } from "./user.interface";


export type IDistributorDocument = Document & IDistributor;

export interface IDistributor {
    _id?           : any;
    kod            : number;
    name           : string;
    status         : boolean;
    users?         : Types.ObjectId[];
    userData?      : IUser[] | any;
    bolge          : string;
    bolgeKod       : number;
    bolgeler?      : string;
    bolgelerKod?   : number;
    bolgeData?     : IDistrict[];
};

export interface IDistributorShort {
    _id?             : string;
    city?            : string;
    cityCode?        : number;
    district?        : string;
    districtCode?    : number;
    distId?          : string;
    altBolge?        : string;
}