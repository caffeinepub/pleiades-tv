import { Link } from '@tanstack/react-router';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, ThumbsUp } from 'lucide-react';
import type { Video } from '../../backend';
import { useLikeCount } from '@/hooks/useQueries';

interface VideoCardProps {
  video: Video;
}

export default function VideoCard({ video }: VideoCardProps) {
  const { data: likeCount } = useLikeCount(video.id);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const thumbnailUrl = video.thumbnailUrl || '/assets/generated/video-thumb-placeholder.dim_640x360.png';

  return (
    <Link to="/video/$videoId" params={{ videoId: video.id }}>
      <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer">
        <div className="relative aspect-video overflow-hidden bg-muted">
          <img
            src={thumbnailUrl}
            alt={video.title}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/assets/generated/video-thumb-placeholder.dim_640x360.png';
            }}
          />
          <div className="absolute bottom-2 right-2">
            <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm">
              <Clock className="h-3 w-3 mr-1" />
              {formatDuration(Number(video.duration))}
            </Badge>
          </div>
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg line-clamp-2 mb-2 group-hover:text-primary transition-colors">
            {video.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {video.description}
          </p>
          {likeCount !== undefined && likeCount > 0 && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <ThumbsUp className="h-3 w-3" />
              <span>{likeCount}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
