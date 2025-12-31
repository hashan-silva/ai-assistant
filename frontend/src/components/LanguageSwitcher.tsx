'use client';

import {FormControl, MenuItem, Select, SelectChangeEvent} from '@mui/material';
import {useLocale, useTranslations} from 'next-intl';
import {usePathname, useRouter} from '@/i18n/navigation';

export default function LanguageSwitcher() {
  const t = useTranslations('common');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleChange = (event: SelectChangeEvent) => {
    const nextLocale = event.target.value as 'sv' | 'en';
    router.replace(pathname, {locale: nextLocale});
  };

  return (
    <FormControl size="small">
      <Select
        value={locale}
        onChange={handleChange}
        aria-label={t('language')}
        sx={{minWidth: 120}}
      >
        <MenuItem value="sv">Svenska</MenuItem>
        <MenuItem value="en">English</MenuItem>
      </Select>
    </FormControl>
  );
}
