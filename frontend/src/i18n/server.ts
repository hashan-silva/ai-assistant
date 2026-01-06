import {headers} from 'next/headers';
import {resolveLocale} from './locale';

export const getServerLocale = () => resolveLocale(headers().get('accept-language'));
