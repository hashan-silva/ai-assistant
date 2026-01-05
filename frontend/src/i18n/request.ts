import {headers} from 'next/headers';
import {getRequestConfig} from 'next-intl/server';
import {defaultLocale, locales} from './routing';

const localeSet = new Set(locales);

const resolveLocale = (headerValue: string | null) => {
  if (!headerValue) {
    return defaultLocale;
  }

  const languages = headerValue.split(',').map((lang) => lang.trim());
  for (const entry of languages) {
    const [code] = entry.split(';');
    const normalized = code.toLowerCase();
    const base = normalized.split('-')[0];

    if (localeSet.has(normalized as (typeof locales)[number])) {
      return normalized as (typeof locales)[number];
    }

    if (localeSet.has(base as (typeof locales)[number])) {
      return base as (typeof locales)[number];
    }
  }

  return defaultLocale;
};

export default getRequestConfig(async () => {
  const headerLocale = headers().get('accept-language');
  const resolvedLocale = resolveLocale(headerLocale);

  return {
    locale: resolvedLocale,
    messages: (await import(`../../messages/${resolvedLocale}.json`)).default
  };
});
