import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useSubscriptionStatus, useSubscribe, useUnsubscribe } from '@/hooks/useQueries';
import { Crown, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface SubscribeButtonProps {
  size?: 'sm' | 'default' | 'lg';
  variant?: 'default' | 'outline';
}

export default function SubscribeButton({ size = 'default', variant = 'default' }: SubscribeButtonProps) {
  const { isAuthenticated, login } = useAuth();
  const { data: isSubscribed, isLoading: statusLoading } = useSubscriptionStatus();
  const subscribe = useSubscribe();
  const unsubscribe = useUnsubscribe();

  const handleClick = async () => {
    if (!isAuthenticated) {
      login();
      return;
    }

    try {
      if (isSubscribed) {
        await unsubscribe.mutateAsync();
        toast.success('Unsubscribed successfully');
      } else {
        await subscribe.mutateAsync();
        toast.success('Subscribed successfully! Enjoy unlimited streaming.');
      }
    } catch (error: any) {
      toast.error(error.message || 'An error occurred');
    }
  };

  const isLoading = subscribe.isPending || unsubscribe.isPending || statusLoading;

  return (
    <Button
      onClick={handleClick}
      disabled={isLoading}
      size={size}
      variant={isSubscribed ? 'outline' : variant}
    >
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          {isSubscribed ? 'Unsubscribing...' : 'Subscribing...'}
        </>
      ) : isSubscribed ? (
        'Unsubscribe'
      ) : (
        <>
          <Crown className="h-4 w-4 mr-2" />
          Subscribe
        </>
      )}
    </Button>
  );
}
