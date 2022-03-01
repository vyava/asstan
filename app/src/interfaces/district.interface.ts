interface IDistrictBaseType {
    code : number;
    name : string;

    district : string;
    districtCode : number;
    city : string;
    cityCode : number;
};

export type IDistrictUser = Pick<IDistrictBaseType, "city" | "cityCode"> & [Pick<IDistrictBaseType, "code" | "name">];