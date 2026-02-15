import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/useAuth';
import { usePostComment, useSubscriptionStatus } from '@/hooks/useQueries';
import { toast } from 'sonner';
import { Loader2, Send } from 'lucide-react';

interface CommentFormProps {
  videoId: string;
}

export default function CommentForm({ videoId }: CommentFormProps) {
  const { isAuthenticated, login } = useAuth();
  const { data: isSubscribed } = useSubscriptionStatus();
  const postComment = usePostComment(videoId);
  const [text, setText] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) {
      toast.error('Please enter a comment');
      return;
    }

    try {
      await postComment.mutateAsync(text.trim());
      setText('');
      toast.success('Comment posted!');
    } catch (error: any) {
      if (error.message?.includes('subscribed')) {
        toast.error('Only subscribers can comment');
      } else {
        toast.error(error.message || 'Failed to post comment');
      }
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="text-center py-6 bg-muted/30 rounded-lg">
        <p className="text-muted-foreground mb-3">Sign in to leave a comment</p>
        <Button onClick={login} variant="outline">
          Sign In
        </Button>
      </div>
    );
  }

  if (!isSubscribed) {
    return (
      <div className="text-center py-6 bg-muted/30 rounded-lg">
        <p className="text-muted-foreground">
          Subscribe to Pleiades TV to comment on videos
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Add a comment..."
        rows={3}
        disabled={postComment.isPending}
      />
      <div className="flex justify-end">
        <Button type="submit" disabled={postComment.isPending || !text.trim()}>
          {postComment.isPending ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Posting...
            </>
          ) : (
            <>
              <Send className="h-4 w-4 mr-2" />
              Post Comment
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
