import { ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useSubscriptionStatus } from '@/hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Crown, Lock } from 'lucide-react';
import SubscribeButton from './SubscribeButton';

interface PlaybackSubscriptionGateProps {
  children: ReactNode;
}

export default function PlaybackSubscriptionGate({ children }: PlaybackSubscriptionGateProps) {
  const { isAuthenticated } = useAuth();
  const { data: isSubscribed, isLoading } = useSubscriptionStatus();

  if (isLoading) {
    return (
      <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !isSubscribed) {
    return (
      <div className="aspect-video bg-gradient-to-br from-muted to-muted/50 rounded-lg flex items-center justify-center p-8">
        <Card className="max-w-md w-full border-2">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              {isAuthenticated ? (
                <Crown className="h-8 w-8 text-primary" />
              ) : (
                <Lock className="h-8 w-8 text-primary" />
              )}
            </div>
            <CardTitle>
              {isAuthenticated ? 'Subscribe to Watch' : 'Sign In to Watch'}
            </CardTitle>
            <CardDescription>
              {isAuthenticated
                ? 'Subscribe to Pleiades TV to unlock unlimited streaming of all videos.'
                : 'Sign in and subscribe to start watching this video.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <SubscribeButton size="lg" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
