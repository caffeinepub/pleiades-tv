import { Button } from '@/components/ui/button';
import { Share2, Loader2 } from 'lucide-react';
import { shareVideo } from '@/utils/share';
import { toast } from 'sonner';
import { useState } from 'react';

interface ShareButtonProps {
  videoId: string;
  title: string;
}

export default function ShareButton({ videoId, title }: ShareButtonProps) {
  const [isSharing, setIsSharing] = useState(false);

  const handleShare = async () => {
    setIsSharing(true);
    try {
      const success = await shareVideo(videoId, title);
      if (success) {
        toast.success('Link copied to clipboard!');
      }
    } catch (error) {
      toast.error('Failed to share video');
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <Button
      onClick={handleShare}
      disabled={isSharing}
      variant="outline"
      size="lg"
      className="gap-2"
    >
      {isSharing ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : (
        <Share2 className="h-5 w-5" />
      )}
      Share
    </Button>
  );
}
