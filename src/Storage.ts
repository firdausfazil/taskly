import { MMKV } from 'react-native-mmkv';

export const storage = new MMKV();

export const getTheme = () => storage.getString('theme') || 'light';
export const setTheme = (theme: any) => storage.set('theme', theme);
