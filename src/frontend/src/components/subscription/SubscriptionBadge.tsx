import { Badge } from '@/components/ui/badge';
import { useSubscriptionStatus } from '@/hooks/useQueries';
import { Crown, Loader2 } from 'lucide-react';

export default function SubscriptionBadge() {
  const { data: isSubscribed, isLoading } = useSubscriptionStatus();

  if (isLoading) {
    return (
      <Badge variant="outline" className="gap-1">
        <Loader2 className="h-3 w-3 animate-spin" />
      </Badge>
    );
  }

  if (isSubscribed) {
    return (
      <Badge className="gap-1 bg-accent text-accent-foreground">
        <Crown className="h-3 w-3" />
        Subscribed
      </Badge>
    );
  }

  return null;
}
