export type ExpandRecursively<T> = T extends object
  ? T extends infer O ? { [K in keyof O]: ExpandRecursively<O[K]> } : never
  : T;

export type FunctionVariadicAnyReturn = (...args: any[]) => any;

export type StringMap = {
  [key: string]: string;
};

export type ObjectWithAnyKey = {
  [key: string]: any;
};

export type ValueOf<T> = T[keyof T];

export type Decrement<T extends number> = T extends 1
  ? 0 : T extends 2
  ? 1 : T extends 3
  ? 2 : T extends 4
  ? 3 : T extends 5
  ? 4 : 5;

export type Unpacked<T, L extends number = 1> = L extends 0
  ? T
  : T extends (infer U)[]
  ? Unpacked<U, Decrement<L>>
  : T extends (...args: any[]) => infer U
  ? Unpacked<U, Decrement<L>>
  : T extends Promise<infer U>
  ? Unpacked<U, Decrement<L>>
  : T extends object
  ? { [K in keyof T]: Unpacked<T[K], Decrement<L>> }
  : T;

export type RequiredField<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type PickNullable<T> = {
  [P in keyof T as null extends T[P] ? P : never]: T[P];
};

export type PickNotNullable<T> = {
  [P in keyof T as null extends T[P] ? never : P]: T[P];
};

export type OptionalNullable<T> = T extends object
  ? {
    [K in keyof PickNotNullable<T>]: OptionalNullable<T[K]>;
  }
  : T;
