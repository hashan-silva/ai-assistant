import {createTranslator} from 'next-intl';
import type {AbstractIntlMessages} from 'next-intl';
import {resolveLocale} from './locale';

export const loadMessages = async (locale: string) =>
  (await import(`../../messages/${locale}.json`)).default as AbstractIntlMessages;

export const getTranslator = async (locale: string, namespace?: string) => {
  const messages = await loadMessages(locale);
  return createTranslator({locale, messages, namespace});
};

export const getRequestLocale = (headerValue: string | null) => resolveLocale(headerValue);
