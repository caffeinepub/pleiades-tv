import { Link, useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Sparkles, User } from 'lucide-react';
import LoginButton from '../auth/LoginButton';
import { useAuth } from '@/hooks/useAuth';
import SubscriptionBadge from '../subscription/SubscriptionBadge';

export default function AppHeader() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <img 
              src="/assets/generated/pleiades-tv-logo.dim_512x512.png" 
              alt="Pleiades TV" 
              className="h-8 w-8"
            />
            <span className="font-display text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Pleiades TV
            </span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="sm">
                Browse
              </Button>
            </Link>
            {isAuthenticated && (
              <Link to="/account">
                <Button variant="ghost" size="sm">
                  <User className="h-4 w-4 mr-2" />
                  Account
                </Button>
              </Link>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {isAuthenticated && <SubscriptionBadge />}
          <LoginButton />
        </div>
      </div>
    </header>
  );
}
