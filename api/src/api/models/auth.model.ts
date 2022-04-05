import { IUser } from "@shared/interfaces";
import { User } from "./user.model";

export async function getUserAuthData(
    id: any
): Promise<IUser> {
    const user = await User.findOne((u) => u.id === id);
    if (!user) return;

    return {
        _id: user.id,
        email: user.email
    };
};

// export async function authLocalUser(
//     email: string,
//     password: string
// ): Promise<IUser> {
//     return new Promise(async (resolve) => {
//         // 1. Find the user in the database
//         // TODO: Replace with the real model instead of mock-data
//         const lcUser = email.toLowerCase();
//         const user = await User.findOne((u: IUser) => u.email.address.toLowerCase() === lcUser);
//         if (!user) return resolve(undefined);

//         // 2. Encode the provided password with its salt
//         const pwd = await encryptPassword(password, user.salt);
//         // 3. Check if the encoded(provided password)
//         // is the same as the provided password
//         if (pwd !== user.pass) return resolve(undefined);

//         // 4. if ok, return the UserAuthData
//         resolve(await getUserAuthData(user.userId));
//     });
// }