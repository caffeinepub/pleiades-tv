import { useVideoCatalog } from '@/hooks/useQueries';
import VideoCard from '@/components/video/VideoCard';
import { Loader2, Tv } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function BrowsePage() {
  const { data: videos, isLoading, error } = useVideoCatalog();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 border-b border-border/40">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src="/assets/generated/pleiades-hero.dim_1600x400.png"
            alt="Pleiades TV Hero"
            className="w-full h-full object-cover opacity-30"
          />
        </div>
        <div className="relative container py-16 md:py-24">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Welcome to Pleiades TV
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-6">
              Stream unlimited videos on-demand. Subscribe today and explore our stellar collection.
            </p>
          </div>
        </div>
      </section>

      {/* Video Catalog */}
      <section className="container py-12">
        <div className="flex items-center gap-3 mb-8">
          <Tv className="h-6 w-6 text-primary" />
          <h2 className="text-3xl font-display font-bold">Browse Videos</h2>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Loading videos...</p>
            </div>
          </div>
        ) : error ? (
          <Alert variant="destructive">
            <AlertDescription>
              Failed to load videos. Please try again later.
            </AlertDescription>
          </Alert>
        ) : videos && videos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {videos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">No videos available yet.</p>
          </div>
        )}
      </section>
    </div>
  );
}
