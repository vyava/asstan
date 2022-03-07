interface IDistrictBaseType {
    code : number;
    name : string;

    district : string;
    districtCode : number;
    city : string;
    cityCode : number;
};

type IDistricts = Pick<IDistrictBaseType, "code" | "name">;

export type IDistrictUser = Pick<IDistrictBaseType, "city" | "cityCode"> & {districts : IDistricts[]};