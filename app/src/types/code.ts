import { BCTWBase } from './common_types';
import { Type } from 'class-transformer';
import { columnToHeader } from 'src/utils/common_helper';
import { ReactNode } from 'react';

// just a string alias, but makes it clearer in other types when property should be a code
type Code = string;

// used in select multiple component 
interface ICodeFilter {
  code_header: string;
  code_header_title: string;
  description: string | number;
  code: string;
  id: number;
}

// used in MapDetails to "group" filters
// only uses description right now since map data is from views
interface IGroupedCodeFilter {
  code_header: string;
  descriptions: string[];
}

/// represents a code and code header coming from backend
interface ICode {
  id: number;
  code: string;
  description: string;
  long_description?: string;
  code_header_title?: string;
}

interface ICodeHeader {
  id: number;
  type: string
  title: string;
  description: string;
}

// fixme:
// export class Code implements BCTWBaseType<Code>, ICode {
//   id: number;
//   code: string;
//   description: string;
//   long_description?: string;
//   code_header_title?: string;
// }

// represents the objects retrieved from the database
export class CodeHeader implements BCTWBase<CodeHeader>, ICodeHeader {
  id: number = 0;
  type: string = ""
  title: string = "";
  description: string = "";

  get displayProps(): (keyof CodeHeader)[] {
    return [];
  }

  static getProps(): (keyof ICode)[] {
    return ['id', 'code', 'description', 'long_description'];
  }

  toJSON(): CodeHeader { return this }

  get identifier(): keyof CodeHeader { return 'id' }

  formatPropAsHeader(str: string): string {
    return columnToHeader(str);
  }
}

export enum eInputType {
    text = 'text',
    number = 'number',
    check = 'check',
    unknown = 'unknown',
    date = 'date',
    datetime = 'datetime',
    time = 'time',
    code = 'code',
    multiline = 'multiline',
  }

// represents what a code header should look like when sending to api
export class CodeHeaderInput implements BCTWBase<CodeHeaderInput> {
  code_category_id: number;
  code_header_name: string;
  code_header_title: string;
  code_header_description: string;
  get identifier(): keyof CodeHeaderInput {
    return 'code_header_name';
  }

  get displayProps(): (keyof CodeHeaderInput)[] {
    return [];
  }

  constructor() {
    this.code_category_id = 1; // the bctw code category
    this.code_header_name = '';
    this.code_header_title = '';
    this.code_header_description = '';
  }

  toJSON(): CodeHeaderInput {
    return this;
  }

  formatPropAsHeader(str: string): string {
    // remove the prepended 'code_' part of the string
    const trimCode = str.slice(str.indexOf('_') + 1);
    return columnToHeader(trimCode);
  }
}

export const CodeFormFields: FormFieldObject<CodeHeaderInput>[] = [
//@ts-ignore
  { prop: 'code_header_name', type: "" },
//@ts-ignore

  { prop: 'code_header_title', type: "" },
//@ts-ignore

  { prop: 'code_header_description', type: "" },
];

export type {
  ICode,
  ICodeFilter,
  IGroupedCodeFilter,
  ICodeHeader,
  Code,
};

/**
 * used to assist defining form types for null property values
 * ex. a device retrieved date could be null, but it should be rendered
 * in a form as a date input
 */
 export type FormFieldObject<T> = Pick<any, 'disabled'| 'required'> & {
    prop: keyof T;
    // prop: KeyType;
    type: eInputType;
    codeName?: string;
    span?: boolean;
    tooltip?: ReactNode;
    validate?: <T>(input: T) => string;
  };