import { columnToHeader } from 'src/utils/common_helper';
import { BCTWBase } from 'src/types/common_types';

export enum eUserRole {
  administrator = 'administrator',
  manager = 'manager',
  observer = 'observer'
}

export type KeyCloakDomainType = 'idir' | 'bceid';

/**
 * interface representing the keycloak object retrieved
 * in the @file UserContext.tsx
 */
export interface IKeyCloakSessionInfo {
  domain: KeyCloakDomainType;
  username: string;
  email: string;
  family_name: string;
  given_name: string;
}

// all user classes implement
type UserBaseType = {
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  role_type: eUserRole;
  domain: KeyCloakDomainType;
  username: string;
};

/**
 * the base user class
 * extended by @class OnboardUser and @class User 
 */

export class UserBase implements UserBaseType {
  firstname: string = "";
  lastname: string = "";
  email: string = "";
  phone: string = "";
  role_type: eUserRole = eUserRole.observer;
  domain: KeyCloakDomainType = "idir";
  username: string = "";
}

export interface IUser extends UserBaseType {
  id: number;
  idir: string;
  bceid: string;
  // indicates if the user is considered the owner of at least one animal
  is_owner?: boolean;
}

/** 
 * the main user class representing a row in the bctw.user table 
 */
export class User extends UserBase implements BCTWBase<User>, IUser {
  is_owner: boolean = false;
  id: number = 0;
  idir: string = "";
  bceid: string = "";

  get is_admin(): boolean {
    return this.role_type === eUserRole.administrator;
  }

  get displayProps(): (keyof User)[] {
    const props: (keyof User)[] = ['username', 'email', 'idir', 'bceid', 'role_type', 'is_owner'];
    // if (isDev()) {
    //   props.unshift('id');
    // }
    return props;
  }

  get name(): string {
    return this.firstname && this.lastname ? `${this.firstname} ${this.lastname}` : 'unknown';
  }

  get identifier(): string {
    return 'id';
  }

  formatPropAsHeader(str: string): string {
    switch (str) {
      case 'idir':
      case 'id':
      case 'bceid':
        return str.toUpperCase();
      default:
        return columnToHeader(str);
    }
  }
}