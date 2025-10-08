import { action, makeObservable, observable, computed } from 'mobx';

import type { ZodError } from 'zod';

export class ErrorModel {
  errors: Record<string, string> = {};

  constructor() {
    makeObservable(this, {
      errors: observable,
      set: action.bound,
      clear: action.bound,
      setFromZodError: action.bound,
      get: action.bound,
      hasErrors: computed,
    });
  }

  set(field: string, message: string) {
    this.errors[field] = message;
  }

  get(field: string) {
    return this.errors[field] ?? '';
  }

  clear() {
    this.errors = {};
  }

  setFromZodError(err: ZodError) {
    this.clear();
    err.issues.forEach((issue) => {
      const key = issue.path[0] as string;
      this.errors[key] = issue.message;
    });
  }

  get hasErrors() {
    return Object.keys(this.errors).length > 0;
  }
}
