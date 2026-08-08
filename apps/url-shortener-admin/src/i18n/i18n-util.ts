import { initI18nSvelte } from 'typesafe-i18n/svelte';
import type { TranslationFunctions, Locales, Formatters } from './i18n-types';
import en_US from './en-US/index';
import vi_VN from './vi-VN/index';

const translations = {
	'en-US': en_US,
	'vi-VN': vi_VN
} as const;

export const { locale, LL, setLocale } = initI18nSvelte<Locales, TranslationFunctions, Formatters>(
	translations as never
);

export type { Locales };
