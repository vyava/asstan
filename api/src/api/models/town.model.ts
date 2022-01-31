import { Model, Schema, model, Document } from "mongoose";
import { ITown } from "../interface/town.interface";


interface TownStatic {
    getTownsByCityNames(cities: string[]): Promise<ITown[]>;
};

class TownStatic {
    static getTownsByCityNames(cities: string[]) {
        return Town.find({
            name: { $in: cities }
        });
    };
}

interface ITownDocument extends Document, ITown { }

interface TownClass extends ITownDocument { };

class TownClass extends Model { }

export interface ITownDocumentModel extends Model<ITownDocument> { }
export type TownModel = TownClass & Document;
type TownType = TownClass & TownStatic & Model<TownModel>;

const schema: Schema = new Schema({
    name: { type: String },
    city: {
        type: Array
    },
    districts: {
        type: Array
    },
    geolocation: {
        lat: { type: Number },
        lon: { type: Number },
        polyhons: { type: Array },
        boundingbox: { type: Array },
        position : [Number, Number]
    }
}, {
    collection: "towns"
});

schema.loadClass(TownStatic);
schema.loadClass(TownClass);

export const Town = model<TownModel>("Town", schema) as TownType
export default Town;