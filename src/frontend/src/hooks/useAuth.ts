import { useInternetIdentity } from './useInternetIdentity';
import { useMemo } from 'react';

export function useAuth() {
  const { identity, login, clear, loginStatus, isInitializing } = useInternetIdentity();

  const isAuthenticated = useMemo(() => !!identity && !identity.getPrincipal().isAnonymous(), [identity]);

  const principalText = useMemo(() => {
    if (!identity || identity.getPrincipal().isAnonymous()) return null;
    return identity.getPrincipal().toString();
  }, [identity]);

  const principalTextShort = useMemo(() => {
    if (!principalText) return null;
    return `${principalText.slice(0, 5)}...${principalText.slice(-3)}`;
  }, [principalText]);

  return {
    identity,
    isAuthenticated,
    principalText,
    principalTextShort,
    login,
    logout: clear,
    loginStatus,
    isInitializing,
  };
}
