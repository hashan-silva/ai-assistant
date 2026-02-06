const normalizeBaseUrl = (value?: string) => {
  const trimmed = value?.trim();
  if (!trimmed) {
    return '';
  }
  return trimmed.endsWith('/') ? trimmed.slice(0, -1) : trimmed;
};

export const buildApiUrl = (path: string) => {
  const baseUrl = normalizeBaseUrl(process.env.NEXT_PUBLIC_API_BASE_URL);
  if (!baseUrl) {
    return path.startsWith('/') ? path : `/${path}`;
  }
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${normalizedPath}`;
};
