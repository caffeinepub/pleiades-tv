import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useLikeCount, useLikeVideo, useUnlikeVideo } from '@/hooks/useQueries';
import { ThumbsUp, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';

interface LikeButtonProps {
  videoId: string;
}

export default function LikeButton({ videoId }: LikeButtonProps) {
  const { isAuthenticated, login } = useAuth();
  const { data: likeCount, isLoading: countLoading } = useLikeCount(videoId);
  const likeVideo = useLikeVideo(videoId);
  const unlikeVideo = useUnlikeVideo(videoId);
  const [isLiked, setIsLiked] = useState(false);

  // Track like state locally for immediate feedback
  useEffect(() => {
    // Reset when video changes
    setIsLiked(false);
  }, [videoId]);

  const handleClick = async () => {
    if (!isAuthenticated) {
      login();
      return;
    }

    try {
      if (isLiked) {
        await unlikeVideo.mutateAsync();
        setIsLiked(false);
        toast.success('Like removed');
      } else {
        await likeVideo.mutateAsync();
        setIsLiked(true);
        toast.success('Video liked!');
      }
    } catch (error: any) {
      // Handle already liked/not liked errors
      if (error.message?.includes('already liked')) {
        setIsLiked(true);
        toast.info('You already liked this video');
      } else if (error.message?.includes('not liked')) {
        setIsLiked(false);
        toast.info('You have not liked this video yet');
      } else {
        toast.error(error.message || 'An error occurred');
      }
    }
  };

  const isLoading = likeVideo.isPending || unlikeVideo.isPending;

  return (
    <Button
      onClick={handleClick}
      disabled={isLoading || countLoading}
      variant={isLiked ? 'default' : 'outline'}
      size="lg"
      className="gap-2"
    >
      {isLoading ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : (
        <ThumbsUp className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
      )}
      <span className="font-semibold">
        {countLoading ? '...' : likeCount || 0}
      </span>
    </Button>
  );
}
