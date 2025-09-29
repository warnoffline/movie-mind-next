import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  type User as FirebaseUser,
  type AuthProvider,
} from 'firebase/auth';
import { action, computed, makeObservable, runInAction } from 'mobx';

import { auth, googleProvider, githubProvider } from '@/configs/firebase';

import { LoadingStageModel } from '../models/LoadingStageModel';
import { ValueModel } from '../models/ValueModel';

import type { AlertStore } from '../AlertStore';

export class UserStore {
  private readonly _user = new ValueModel<FirebaseUser | null>(null);
  readonly loadingStage = new LoadingStageModel();
  private readonly alertStore: AlertStore;

  constructor(alertStore: AlertStore) {
    this.alertStore = alertStore;

    makeObservable(this, {
      user: computed,
      isAuthorized: computed,
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

  private setUser(user: FirebaseUser | null) {
    this._user.change(user);
  }

  private initializeAuthListener() {
    this.loadingStage.loading();

    onAuthStateChanged(auth, (user) => {
      runInAction(() => {
        this.setUser(user);
        this.loadingStage.success();
      });
    });
  }

  loginWithEmail = async (email: string, password: string) => {
    this.loadingStage.loading();
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      this.setUser(result.user);
      this.alertStore.add('Вход выполнен успешно', 'success');
    } catch (error) {
      this.alertStore.add('Неверные данные', 'error');
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
      this.alertStore.add('Регистрация выполнена успешно', 'success');
    } catch (error) {
      this.alertStore.add('Ошибка регистрации', 'error');
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
      this.alertStore.add('Вход выполнен успешно', 'success');
    } catch (error: unknown) {
      this.alertStore.add(`Ошибка входа: ${(error as Error).message}`, 'error');
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
      this.alertStore.add('Вы вышли из аккаунта', 'info');
    } catch {
      this.loadingStage.error();
      this.alertStore.add('Ошибка при выходе из аккаунта', 'error');
    } finally {
      this.loadingStage.success();
    }
  };
}
