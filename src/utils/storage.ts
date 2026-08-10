import { Platform } from 'react-native';
import { createJSONStorage } from 'zustand/middleware';

let mmkv: any = null;
if (Platform.OS !== 'web') {
  const { createMMKV } = require('react-native-mmkv');
  mmkv = createMMKV();
}

const mmkvStorage = {
  getItem: (name: string) => {
    if (Platform.OS === 'web') {
      return localStorage.getItem(name);
    }
    const value = mmkv?.getString(name);
    return value ?? null;
  },
  setItem: (name: string, value: string) => {
    if (Platform.OS === 'web') {
      localStorage.setItem(name, value);
    } else {
      mmkv?.set(name, value);
    }
  },
  removeItem: (name: string) => {
    if (Platform.OS === 'web') {
      localStorage.removeItem(name);
    } else {
      mmkv?.delete(name);
    }
  },
};

export const zustandStorage = createJSONStorage(() => mmkvStorage);

export type ZustandStorage = typeof zustandStorage;