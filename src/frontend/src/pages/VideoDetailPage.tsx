import { useParams } from '@tanstack/react-router';
import { useVideo } from '@/hooks/useQueries';
import { Loader2, Calendar, Clock, ArrowLeft } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Link } from '@tanstack/react-router';
import VideoPlayer from '@/components/video/VideoPlayer';
import PlaybackSubscriptionGate from '@/components/subscription/PlaybackSubscriptionGate';
import LikeButton from '@/components/likes/LikeButton';
import ShareButton from '@/components/share/ShareButton';
import CommentsSection from '@/components/comments/CommentsSection';
import { useAuth } from '@/hooks/useAuth';
import ProfileSetupModal from '@/components/auth/ProfileSetupModal';
import { useGetCallerUserProfile } from '@/hooks/useQueries';

export default function VideoDetailPage() {
  const { videoId } = useParams({ from: '/video/$videoId' });
  const { data: video, isLoading, error } = useVideo(videoId);
  const { isAuthenticated } = useAuth();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();

  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="container py-12 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading video...</p>
        </div>
      </div>
    );
  }

  if (error || !video) {
    return (
      <div className="container py-12">
        <Alert variant="destructive">
          <AlertDescription>
            Failed to load video. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <ProfileSetupModal open={showProfileSetup} />
      
      <div className="container py-8 space-y-8">
        {/* Back Button */}
        <Link to="/">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Browse
          </Button>
        </Link>

        {/* Video Player */}
        <PlaybackSubscriptionGate>
          <VideoPlayer videoUrl={video.videoUrl} title={video.title} />
        </PlaybackSubscriptionGate>

        {/* Video Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">
              {video.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {formatDate(video.createdTimestamp)}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {formatDuration(Number(video.duration))}
              </div>
            </div>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {video.description}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <LikeButton videoId={video.id} />
            <ShareButton videoId={video.id} title={video.title} />
          </div>
        </div>

        {/* Comments Section */}
        <CommentsSection videoId={video.id} />
      </div>
    </div>
  );
}
