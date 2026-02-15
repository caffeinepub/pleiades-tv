import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useQueryClient } from '@tanstack/react-query';
import { LogIn, LogOut, Loader2 } from 'lucide-react';

export default function LoginButton() {
  const { isAuthenticated, login, logout, loginStatus } = useAuth();
  const queryClient = useQueryClient();

  const isLoggingIn = loginStatus === 'logging-in';

  const handleAuth = async () => {
    if (isAuthenticated) {
      await logout();
      queryClient.clear();
    } else {
      try {
        await login();
      } catch (error: any) {
        console.error('Login error:', error);
        if (error.message === 'User is already authenticated') {
          await logout();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  return (
    <Button
      onClick={handleAuth}
      disabled={isLoggingIn}
      variant={isAuthenticated ? 'outline' : 'default'}
      size="sm"
    >
      {isLoggingIn ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Signing in...
        </>
      ) : isAuthenticated ? (
        <>
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </>
      ) : (
        <>
          <LogIn className="h-4 w-4 mr-2" />
          Sign In
        </>
      )}
    </Button>
  );
}
