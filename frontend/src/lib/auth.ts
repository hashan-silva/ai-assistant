export const ACCESS_TOKEN_KEY = 'ai-assistant_access_token';
export const ID_TOKEN_KEY = 'ai-assistant_id_token';
export const REFRESH_TOKEN_KEY = 'ai-assistant_refresh_token';

export const getAccessToken = () => {
  if (typeof window === 'undefined') {
    return null;
  }
  return window.localStorage.getItem(ACCESS_TOKEN_KEY);
};

export const persistTokens = (tokens: {
  accessToken?: string;
  idToken?: string;
  refreshToken?: string;
}) => {
  if (typeof window === 'undefined') {
    return;
  }
  if (tokens.accessToken) {
    window.localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
  }
  if (tokens.idToken) {
    window.localStorage.setItem(ID_TOKEN_KEY, tokens.idToken);
  }
  if (tokens.refreshToken) {
    window.localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
  }
};
