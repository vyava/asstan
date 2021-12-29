export interface ITapdkRequest {
    __VIEWSTATE? : string;
    __EVENTVALIDATION? : string;
    __EVENTTARGET? : TARGET.DROP | TARGET.FILE;
    dd_il? : number;
    dd_tarih? : number;
    dd_islem? : number;
    TXT_SICIL? : string;
    DropDownList_CountViewGrid? : number
}

export enum TARIH {
    dun =1,
    bugun= 0,
    haftabasi = "week",
    aybasi = "month",
    yilbasi = "year"
}

export enum TARGET {
    FILE = "Button_Print",
    DROP = "DropDownList_CountViewGrid"
}