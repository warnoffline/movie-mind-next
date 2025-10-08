import { action, computed, makeObservable, observable } from 'mobx';

import { LoadingStage } from '@/types/meta';

export class LoadingStageModel {
  private _value: LoadingStage;

  constructor(value: LoadingStage = LoadingStage.notStarted) {
    this._value = value;

    makeObservable<LoadingStageModel, '_value'>(this, {
      _value: observable,
      value: computed,
      isNotStarted: computed,
      isLoading: computed,
      isSuccess: computed,
      isError: computed,
      isFinished: computed,
      loading: action,
      success: action,
      error: action,
      reset: action,
    });
  }

  get value(): LoadingStage {
    return this._value;
  }

  get isNotStarted(): boolean {
    return this._value === LoadingStage.notStarted;
  }

  get isLoading(): boolean {
    return this._value === LoadingStage.loading;
  }

  get isSuccess(): boolean {
    return this._value === LoadingStage.success;
  }

  get isError(): boolean {
    return this._value === LoadingStage.error;
  }

  get isFinished(): boolean {
    return this._value === LoadingStage.success || this._value === LoadingStage.error;
  }

  loading = (): void => {
    this._value = LoadingStage.loading;
  };

  success = (): void => {
    this._value = LoadingStage.success;
  };

  error = (): void => {
    this._value = LoadingStage.error;
  };

  reset = (): void => {
    this._value = LoadingStage.notStarted;
  };
}
