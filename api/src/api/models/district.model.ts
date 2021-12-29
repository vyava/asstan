import { Model, Schema, model, Document } from "mongoose";

export interface IDistrict {
    district: string;
    districtCode : number;
    city: string;
    cityCode: number;
};

export interface IDistrictDocument extends Document, IDistrict {}

interface DistrictStatic {
    findAllCities() : Promise<IDistrictDocument[]>
};

class DistrictStatic {
    static async findAllDistrict(){
        return District.find({});
    }
}

export class DistrictClass extends Model {
    district!: string;
    districtCode!: number;
    city: string;
    cityCode : number;
};

export type DistrictModel = DistrictClass & Document;
type DistrictType = DistrictClass & DistrictStatic & Model<DistrictModel>;

const schema = new Schema<IDistrictDocument>({ district: String, districtCode: Number, city: String, cityCode : Number }, { collection: "district" });

schema.loadClass(DistrictClass);
schema.loadClass(DistrictStatic);

export const District = model<DistrictModel>("District", schema) as DistrictType;
export default District;