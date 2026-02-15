import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useSubscriptionStatus, useGetCallerUserProfile } from '@/hooks/useQueries';
import { User, Crown, Loader2 } from 'lucide-react';
import SubscribeButton from '@/components/subscription/SubscribeButton';
import { Separator } from '@/components/ui/separator';

export default function AccountPage() {
  const { principalText, principalTextShort } = useAuth();
  const { data: isSubscribed, isLoading: subLoading } = useSubscriptionStatus();
  const { data: userProfile, isLoading: profileLoading } = useGetCallerUserProfile();

  return (
    <div className="container py-12 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-display font-bold mb-2">Account</h1>
        <p className="text-muted-foreground">Manage your Pleiades TV account and subscription</p>
      </div>

      <div className="grid gap-6">
        {/* Profile Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {profileLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-muted-foreground">Loading profile...</span>
              </div>
            ) : userProfile ? (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Name</label>
                <p className="text-lg font-semibold">{userProfile.name}</p>
              </div>
            ) : null}
            
            <Separator />
            
            <div>
              <label className="text-sm font-medium text-muted-foreground">Principal ID</label>
              <div className="flex items-center gap-2 mt-1">
                <code className="text-sm bg-muted px-3 py-1 rounded font-mono">
                  {principalTextShort}
                </code>
                <Badge variant="outline" className="text-xs">
                  Verified
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-2 break-all">
                Full ID: {principalText}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Subscription Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5" />
              Subscription
            </CardTitle>
            <CardDescription>
              Manage your Pleiades TV subscription
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {subLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-muted-foreground">Loading subscription status...</span>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Status</p>
                    <p className="text-sm text-muted-foreground">
                      {isSubscribed
                        ? 'You have full access to all videos'
                        : 'Subscribe to unlock unlimited streaming'}
                    </p>
                  </div>
                  <Badge variant={isSubscribed ? 'default' : 'outline'} className="text-sm">
                    {isSubscribed ? (
                      <>
                        <Crown className="h-3 w-3 mr-1" />
                        Active
                      </>
                    ) : (
                      'Inactive'
                    )}
                  </Badge>
                </div>
                
                <Separator />
                
                <div className="flex justify-end">
                  <SubscribeButton size="lg" />
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
