import { Document, Types } from "mongoose";
import { IUser } from "@shared/interfaces";


export type IUserDocument = Document & IUser;

export interface Mail {
    address : string;
    name : string;
}

export interface IUserMail {
    email           : Mail;
    name?           : string;
    taskName        : string;
    roleInMail      : string;
}

export interface INewUser {
    _id?            : any;
    name?           : string;
    email?          : string;
    taskName?       : string;
    distributor?    : [Types.ObjectId];
    password?       : string;
}

// export interface IDSM extends IUser {
//     area : string;
//     taskName : string;
//     distributor : string;
// }

// export interface ITTE extends IUser {
//     area : string;
//     taskName : string;
//     distributor : string;
// }

// export interface IOperator extends IUser {
//     area : string;
//     taskName : string;
//     distributor : string;
// }

// export interface IRSM extends IUser {
//     area : string[];
//     taskName : string;
//     distributor : string;
// }