import { Model, Schema, model, Document } from "mongoose";

interface ITown {
    name: string;
    towns: any;
    geolocation: any;
}
interface ITownDocument extends Document, ITown { }

export interface ITownDocumentModel extends Model<ITownDocument> { }

const townSchema: Schema = new Schema({
    name: { type: String },
    city: {
        type: Array
    },
    districts : {
        type : Array
    },
    geolocation: {
        type: Object
    }
}, {
    collection: "towns"
});

export const Town: ITownDocumentModel = model<ITownDocument, ITownDocumentModel>("Town", townSchema);