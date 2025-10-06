import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  type User as FirebaseUser,
  type AuthProvider,
} from 'firebase/auth';
import { action, computed, makeObservable } from 'mobx';

import { auth, googleProvider, githubProvider } from '@/configs/firebase';

import { LoadingStageModel } from '../models/LoadingStageModel';
import { ValueModel } from '../models/ValueModel';

import type { AlertStore } from '../AlertStore';

export class UserStore {
  private readonly _user = new ValueModel<FirebaseUser | null>(null);
  readonly loadingStage = new LoadingStageModel();

  private readonly _alertStore: AlertStore;

  constructor(alertStore: AlertStore) {
    this._alertStore = alertStore;

    makeObservable(this, {
      user: computed,
      isAuthorized: computed,
      setUser: action.bound,
      loginWithEmail: action.bound,
      registerWithEmail: action.bound,
      loginWithGoogle: action.bound,
      loginWithGithub: action.bound,
      logout: action.bound,
    });

    this.initializeAuthListener();
  }

  get user() {
    return this._user.value;
  }

  get isAuthorized() {
    return !!this.user;
  }

  setUser(user: FirebaseUser | null) {
    this._user.change(user);
  }

  private initializeAuthListener() {
    this.loadingStage.loading();

    onAuthStateChanged(auth, (user) => {
      this.setUser(user);
      this.loadingStage.success();
    });
  }

  loginWithEmail = async (email: string, password: string) => {
    this.loadingStage.loading();
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      this.setUser(result.user);
      this._alertStore.add('Вход выполнен успешно', 'success');
    } catch (error) {
      this._alertStore.add('Неверные данные', 'error');
      throw error;
    } finally {
      this.loadingStage.success();
    }
  };

  registerWithEmail = async (email: string, password: string) => {
    this.loadingStage.loading();
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      this.setUser(result.user);
      this._alertStore.add('Регистрация выполнена успешно', 'success');
    } catch (error) {
      this._alertStore.add('Ошибка регистрации', 'error');
      throw error;
    } finally {
      this.loadingStage.success();
    }
  };

  private loginWithProvider = async (provider: AuthProvider) => {
    this.loadingStage.loading();
    try {
      const result = await signInWithPopup(auth, provider);
      this.setUser(result.user);
      this._alertStore.add('Вход выполнен успешно', 'success');
    } catch (error: unknown) {
      this._alertStore.add(`Ошибка входа: ${(error as Error).message}`, 'error');
    } finally {
      this.loadingStage.success();
    }
  };

  loginWithGoogle = () => this.loginWithProvider(googleProvider);
  loginWithGithub = () => this.loginWithProvider(githubProvider);

  logout = async () => {
    this.loadingStage.loading();
    try {
      await signOut(auth);
      this._user.reset();
      this._alertStore.add('Вы вышли из аккаунта', 'info');
    } catch {
      this.loadingStage.error();
      this._alertStore.add('Ошибка при выходе из аккаунта', 'error');
    } finally {
      this.loadingStage.success();
    }
  };
}
