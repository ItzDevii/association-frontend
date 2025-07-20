'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import Keycloak from 'keycloak-js';
import { setAuthToken } from '@/authToken';

const keycloak = new Keycloak({
  url: 'http://localhost:8080',
  realm: 'association',
  clientId: 'association-frontend',
});

export interface AuthContextType {
  token: string | null;
  initialized: boolean;
  authenticated: boolean;
  username: string | null;
  login: () => void;
  logout: () => void;
  keycloakInstance: Keycloak | null;
}

const AuthContext = createContext<AuthContextType>({
  token: null,
  initialized: false,
  authenticated: false,
  username: null,
  login: () => {},
  logout: () => {},
  keycloakInstance: null,
});

export const useAuth = () => useContext(AuthContext);

export const KeycloakProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setTokenState] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    keycloak
      .init({
        onLoad: 'login-required',
        pkceMethod: 'S256',
        checkLoginIframe: false,
      })
      .then((auth) => {
        setAuthenticated(auth);
        setInitialized(true);

        if (auth && keycloak.token) {
          setTokenState(keycloak.token);
          setAuthToken(keycloak.token);

          const payload = JSON.parse(atob(keycloak.token.split('.')[1]));
          setUsername(payload?.preferred_username || null);
        }

        keycloak.onTokenExpired = () => {
          keycloak.updateToken(60).then((refreshed) => {
            if (refreshed && keycloak.token) {
              setTokenState(keycloak.token);
              setAuthToken(keycloak.token);

              const payload = JSON.parse(atob(keycloak.token.split('.')[1]));
              setUsername(payload?.preferred_username || null);
            }
          });
        };
      })
      .catch((err) => {
        console.error('Keycloak initialization failed:', err);
        setInitialized(true);
      });
  }, []);

  const login = () => keycloak.login();
  const logout = () => keycloak.logout({ redirectUri: window.location.origin });

  return (
    <AuthContext.Provider
      value={{
        token,
        initialized,
        authenticated,
        username,
        login,
        logout,
        keycloakInstance: keycloak,
      }}
    >
      {initialized ? children : <p className="text-center p-4">Loading Keycloak...</p>}
    </AuthContext.Provider>
  );
};