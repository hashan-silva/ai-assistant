export const ACCESS_TOKEN_KEY = 'ai-assistant_access_token';
export const ID_TOKEN_KEY = 'ai-assistant_id_token';
export const REFRESH_TOKEN_KEY = 'ai-assistant_refresh_token';
export const USER_NAME_KEY = 'ai-assistant_user_name';

const safeStorage = () => {
  if (typeof window === 'undefined') {
    return null;
  }
  return window.localStorage;
};

export const persistTokens = (tokens: {
  accessToken?: string;
  idToken?: string;
  refreshToken?: string;
  userName?: string;
}) => {
  const storage = safeStorage();
  if (!storage) {
    return;
  }
  if (tokens.accessToken) {
    storage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
  }
  if (tokens.idToken) {
    storage.setItem(ID_TOKEN_KEY, tokens.idToken);
  }
  if (tokens.refreshToken) {
    storage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
  }
  if (tokens.userName) {
    storage.setItem(USER_NAME_KEY, tokens.userName);
  }
};

export const clearAuth = () => {
  const storage = safeStorage();
  if (!storage) {
    return;
  }
  storage.removeItem(ACCESS_TOKEN_KEY);
  storage.removeItem(ID_TOKEN_KEY);
  storage.removeItem(REFRESH_TOKEN_KEY);
  storage.removeItem(USER_NAME_KEY);
};

export const getAccessToken = () => safeStorage()?.getItem(ACCESS_TOKEN_KEY) || null;
export const getUserName = () => safeStorage()?.getItem(USER_NAME_KEY) || null;
