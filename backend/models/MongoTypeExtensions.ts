import { NonFunctionProperties } from "@common/TypeExtensions";

export type MongoSchemaInternal<K extends string | number | symbol> = { [P in (K extends Function ? never : K)]: any };
export type MongoSchema<T> = MongoSchemaInternal<Exclude<keyof NonFunctionProperties<T>, "_id">>;

export type MongoModel<T, K> = Pick<T, Exclude<keyof T, "_id">> & K;