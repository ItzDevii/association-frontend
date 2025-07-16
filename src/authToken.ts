let token: string | null = null;

export const setAuthToken = (newToken: string | null) => {
  token = newToken;
};

export const getAuthToken = () => token;