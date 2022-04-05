export interface Mail {
    address : string;
    name : string;
};

export interface IUser {
    _id?             : any;
    name?            : string;
    email?           : Mail;
    roleInMail?      : string;
    taskName?        : string;
    status?          : boolean;
    distributor?     : [any];
    password?        : string;
    hash?            : string;
    role?            : string;
}