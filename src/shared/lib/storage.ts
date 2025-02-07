import { isClient } from '@/shared/lib/utils';

export interface Storage {
  set: typeof window.localStorage.setItem;
  get: typeof window.localStorage.getItem;
  remove: typeof window.localStorage.removeItem;
}

export const storage: Storage = {
  set: (key: string, value: string, isSession = false) => {
    if (!isSession) {
      if (isClient() && window.localStorage) {
        window.localStorage.setItem(key, value);
      }
    } else {
      if (isClient() && window.sessionStorage) {
        window.sessionStorage.setItem(key, value);
      }
    }
  },
  get: (key: string, isSession = false) => {
    if (!isSession) {
      if (isClient() && window.localStorage) {
        return window.localStorage.getItem(key);
      }
    } else {
      if (isClient() && window.sessionStorage) {
        return window.sessionStorage.getItem(key);
      }
    }

    return null;
  },
  remove: (key: string, isSession = false) => {
    if (!isSession) {
      if (isClient() && window.localStorage) {
        window.localStorage.removeItem(key);
      }
    } else {
      if (isClient() && window.sessionStorage) {
        window.sessionStorage.removeItem(key);
      }
    }
  },
};
