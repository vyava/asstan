import { randomBytes, pbkdf2Sync } from 'crypto';

const KEY_LEN = 64;

export async function encryptPassword(
  pass: string
): Promise<string> {
  return new Promise<string>((resolve, reject) => {

    let salt = randomBytes(16).toString('hex');

    let hash = pbkdf2Sync(pass, salt, 1000, 64 ,'sha512').toString('hex');

    resolve(hash);
  });
}

export function validatePassword(password: string, salt: string): string {
  let hash = pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString();

  return hash;
}