import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type VideoId = string;
export interface Video {
    id: VideoId;
    title: string;
    duration: bigint;
    thumbnailUrl: string;
    description: string;
    createdTimestamp: bigint;
    videoUrl: string;
}
export interface Comment {
    text: string;
    author: Principal;
    timestamp: bigint;
}
export interface UserProfile {
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getComments(videoId: VideoId): Promise<Array<Comment>>;
    getLikeCount(videoId: VideoId): Promise<bigint>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getVideo(videoId: VideoId): Promise<Video>;
    getVideoCatalog(): Promise<Array<Video>>;
    isCallerAdmin(): Promise<boolean>;
    isSubscribed(): Promise<boolean>;
    likeVideo(videoId: VideoId): Promise<void>;
    postComment(videoId: VideoId, text: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    subscribe(): Promise<void>;
    unlikeVideo(videoId: VideoId): Promise<void>;
    unsubscribe(): Promise<void>;
}
