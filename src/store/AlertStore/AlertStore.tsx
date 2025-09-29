import { makeObservable, action, computed } from 'mobx';

import { ValueModel } from '../models/ValueModel';

export type AlertType = 'success' | 'error' | 'info';

export type Alert = {
  id: string;
  message: string;
  type: AlertType;
};

export class AlertStore {
  private readonly _alerts: ValueModel<Alert[]> = new ValueModel<Alert[]>([]);

  constructor() {
    makeObservable(this, {
      alerts: computed,
      add: action.bound,
      remove: action.bound,
    });
  }

  get alerts() {
    return this._alerts.value;
  }

  add(message: string, type: AlertType = 'info') {
    const id = Math.random().toString(36).substring(2, 9);
    this._alerts.change([...this._alerts.value, { id, message, type }]);

    setTimeout(() => this.remove(id), 5000);
  }

  remove(id: string) {
    this._alerts.change(this._alerts.value.filter((a) => a.id !== id));
  }
}
