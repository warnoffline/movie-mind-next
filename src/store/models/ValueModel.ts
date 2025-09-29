import { action, computed, makeObservable, observable } from 'mobx';

import type { Validator, ValidatorResult } from '@/types/validator';

export class ValueModel<T = string> {
  protected _value: T;
  protected _touched = false;
  protected initialValue: T;
  private validators: Validator<T>[];
  private _error: ValidatorResult = null;

  constructor(value: T, validators: Validator<T>[] = []) {
    this._value = value;
    this.initialValue = value;
    this.validators = validators;
    this.validate = this.validate.bind(this);

    makeObservable<ValueModel<T>, '_value' | '_touched' | '_error' | 'changeError'>(this, {
      _value: observable,
      _touched: observable,
      _error: observable,

      value: computed,
      touched: computed,
      error: computed,
      isError: computed,

      change: action.bound,
      resetTouched: action.bound,
      changeError: action.bound,
      validate: action.bound,
      changeInitial: action.bound,
    });
  }

  get isError(): boolean {
    return this._error !== null;
  }

  get value(): T {
    return this._value;
  }

  get touched(): boolean {
    return this._touched;
  }

  get error(): ValidatorResult {
    return this._error;
  }

  validate(): boolean {
    let error: ValidatorResult = null;

    for (const validator of this.validators) {
      error = validator(this._value);

      if (error) {
        break;
      }
    }

    this.changeError(error);

    return this.isError;
  }

  changeInitial(value: T) {
    this.initialValue = value;
  }

  change(value: T, needToChangeInitial = false): void {
    if (needToChangeInitial) {
      this.changeInitial(value);
    }

    if (value === this._value) {
      return;
    }

    this._value = value;
    this.resetError();
    this._touched = true;
  }

  changeError(result: ValidatorResult): void {
    this._error = result;
  }

  resetValue(): void {
    this.change(this.initialValue);
  }

  resetError(): void {
    this.changeError(null);
  }

  resetTouched(): void {
    this._touched = false;
  }

  reset(): void {
    this.resetValue();
    this.resetError();
    this.resetTouched();
  }
}
