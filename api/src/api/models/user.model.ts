import { Model, Document, Schema, model } from "mongoose";
import { IUserDocument, IUser, INewUser } from "../interface";
import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";
import { randomBytes, pbkdf2Sync } from "crypto";

interface UserStatic {
    getUser(id: string): Promise<IUser>;
    getUserByEmail(email: string): Promise<UserModel>;
    getUsers(): Promise<IUserDocument[]>;
    createUser(user: INewUser): Promise<IUser>;
    genPassword(password: string): any;
    findAndGenerateToken(payload: { email: string, password: string }): INewUser;
    getUserByToken(token: string): Promise<IUser>
};

class UserStatic {
    static async findAndGenerateToken(payload: { email: string, password: string }) {
        const { email, password } = payload
        if (!email) throw new Error('Email must be provided for login')

        const user = await this.getUserByEmail(email);
        if (!user) throw new Error(`No user associated with ${email}`)

        const passwordOK = user.passwordMatches(password);

        if (!passwordOK) throw new Error(`Password mismatch`)

        if (!user.active) throw new Error(`User not activated`)

        return user
    };

    static getUserByToken(token: string) {
        let { _id } = jwt.decode(token) as any;
        return User.findOne({ _id });
    }

    static getUser(id: string) {
        return User.findOne({ _id: id });
    };

    static getUserByEmail(email: string) {
        return User.findOne({ "email.address": email });
    };

    static getUsers() {
        return User.find().populate({
            path: "distributor",
            select: ["kod", "name"]
        });
    };

    static genPassword(password: string) {
        let genHash = bcrypt.hashSync(password, 10);

        return {
            hash: genHash,
        };
    }

    static async createUser(user: IUser) {
        try {
            let { hash } = this.genPassword(user.password);
            let _user = {
                name: user.name,
                email: {
                    address: user.email,
                    name: user.name
                },
                hash: hash
            };
            return await new User(_user).save();
        } catch (error) {
            throw error;
        }
    };
};

interface UserClass extends IUserDocument {
    validatePassword(email: string, password: string): Promise<boolean>;
};

class UserClass extends Model {
    constructor(user) {
        super(user)
    };

    async setPassword(password: string) {
        this.password = password;
    };

    async validatePassword(password) {
        return bcrypt.compareSync(password, this.hash)
    }
};


export type UserModel = UserClass & Document;
type UserType = UserClass & UserStatic & Model<UserModel>;

const schema = new Schema<IUserDocument>({
    name: { type: String, required: false },
    email: {
        address: {
            type: String,
            required: true,
            unique: false,
            sparse: true
        },
        name: {
            type: String,
            required: true
        }
    },
    taskName: {
        type: String,
        enum: ["rsm", "dsm", "tte", "operator", "Tanımsız"],

        default: "Tanımsız"
    },
    roleInMail: {
        type: String,
        required: false,
        enum: ["to", "cc", "bcc"],
        trim: true,
        default: "to"
    },
    status: {
        type: Boolean,
        default: true
    },
    salt: String,
    hash: String,
    distributor: [{
        type: Schema.Types.ObjectId, ref: 'Dist', default: null
    }]
}, {
    collection: "users",
    timestamps: {
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
});

schema.loadClass(UserStatic);
schema.loadClass(UserClass);

export const User = model<UserModel>("User", schema) as UserType;
export default User;