import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Video, Comment, UserProfile } from '../backend';

// Video Catalog
export function useVideoCatalog() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Video[]>({
    queryKey: ['videos'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getVideoCatalog();
    },
    enabled: !!actor && !actorFetching,
  });
}

// Single Video
export function useVideo(videoId: string) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Video>({
    queryKey: ['video', videoId],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getVideo(videoId);
    },
    enabled: !!actor && !actorFetching && !!videoId,
  });
}

// Subscription Status
export function useSubscriptionStatus() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['subscriptionStatus'],
    queryFn: async () => {
      if (!actor) return false;
      try {
        return await actor.isSubscribed();
      } catch (error) {
        // User not authenticated or other error
        return false;
      }
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}

// Subscribe Mutation
export function useSubscribe() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      await actor.subscribe();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptionStatus'] });
    },
  });
}

// Unsubscribe Mutation
export function useUnsubscribe() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      await actor.unsubscribe();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptionStatus'] });
    },
  });
}

// Comments
export function useComments(videoId: string) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Comment[]>({
    queryKey: ['comments', videoId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getComments(videoId);
    },
    enabled: !!actor && !actorFetching && !!videoId,
  });
}

// Post Comment Mutation
export function usePostComment(videoId: string) {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (text: string) => {
      if (!actor) throw new Error('Actor not available');
      await actor.postComment(videoId, text);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', videoId] });
    },
  });
}

// Like Count
export function useLikeCount(videoId: string) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<number>({
    queryKey: ['likeCount', videoId],
    queryFn: async () => {
      if (!actor) return 0;
      const count = await actor.getLikeCount(videoId);
      return Number(count);
    },
    enabled: !!actor && !actorFetching && !!videoId,
  });
}

// Like Video Mutation
export function useLikeVideo(videoId: string) {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      await actor.likeVideo(videoId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['likeCount', videoId] });
      queryClient.invalidateQueries({ queryKey: ['userLikes'] });
    },
  });
}

// Unlike Video Mutation
export function useUnlikeVideo(videoId: string) {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      await actor.unlikeVideo(videoId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['likeCount', videoId] });
      queryClient.invalidateQueries({ queryKey: ['userLikes'] });
    },
  });
}

// User Profile
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

// Save User Profile
export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      await actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}
