import {headers} from 'next/headers';
import {getRequestConfig} from 'next-intl/server';
import {resolveLocale} from './locale';

export default getRequestConfig(async () => {
  const headerLocale = headers().get('accept-language');
  const resolvedLocale = resolveLocale(headerLocale);

  return {
    locale: resolvedLocale,
    messages: (await import(`../../messages/${resolvedLocale}.json`)).default
  };
});
