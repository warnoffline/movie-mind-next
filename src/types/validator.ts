export type ValidatorResult = null | string;

export type Validator<T> = (value: T) => ValidatorResult;
