import { Model, Schema, model, Document } from "mongoose";
import { ITown } from "../interface/town.interface";


interface TownStatic {
    getTownsByCityNames(query: Object[]): Promise<ITown[]>;
};

class TownStatic {
    static getTownsByCityNames(query: Object[]) {
        return Town.find({
            $and: [
                { city: { $in: query.map((q: any) => q.city) } },
                { name: { $in: query.map((q: any) => q.town) } }
            ],
        }, {
            "city": 1,
            "name": 1,
            "geolocation": {
                "lat": 1,
                "lng": 1,
                "position" : 1
            }
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
        type: String
    },
    districts: {
        type: Array
    },
    geolocation: {
        lat: { type: Number },
        lng: { type: Number },
        polygons: { type: Array },
        boundingbox: { type: Array },
        position: { type : Array }
    }
}, {
    collection: "towns"
});

schema.loadClass(TownStatic);
schema.loadClass(TownClass);

export const Town = model<TownModel>("Town", schema) as TownType
export default Town;