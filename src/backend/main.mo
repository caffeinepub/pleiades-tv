import Map "mo:core/Map";
import Set "mo:core/Set";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  type VideoId = Text;

  type Video = {
    id : VideoId;
    title : Text;
    description : Text;
    thumbnailUrl : Text;
    videoUrl : Text;
    duration : Nat;
    createdTimestamp : Int;
  };

  type Comment = {
    author : Principal;
    text : Text;
    timestamp : Int;
  };

  public type UserProfile = {
    name : Text;
  };

  let videos = Map.empty<VideoId, Video>();

  let comments = Map.empty<VideoId, [Comment]>();

  let likes = Map.empty<VideoId, Set.Set<Principal>>();

  let subscriptions = Set.empty<Principal>();

  let userProfiles = Map.empty<Principal, UserProfile>();

  let seedVideos = [
    {
      id = "video1";
      title = "Pleiades TV - Welcome";
      description = "Welcome to Pleiades TV streaming!";
      thumbnailUrl = "https://example.com/thumbnail1.jpg";
      videoUrl = "https://example.com/video1.mp4";
      duration = 300;
      createdTimestamp = Time.now();
    },
    {
      id = "video2";
      title = "Pleiades TV - Feature";
      description = "Feature Video on Pleiades TV.";
      thumbnailUrl = "https://example.com/thumbnail2.jpg";
      videoUrl = "https://example.com/video2.mp4";
      duration = 450;
      createdTimestamp = Time.now();
    },
  ];

  for (video in seedVideos.values()) {
    videos.add(video.id, video);
  };

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Video Catalog - Public access (guests can browse)
  public query ({ caller }) func getVideoCatalog() : async [Video] {
    videos.values().toArray();
  };

  // Video Details - Public access (guests can view metadata)
  public query ({ caller }) func getVideo(videoId : VideoId) : async Video {
    switch (videos.get(videoId)) {
      case (null) { Runtime.trap("Video does not exist.") };
      case (?video) { video };
    };
  };

  // Subscription Management - Requires authenticated user
  public query ({ caller }) func isSubscribed() : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can check subscription status");
    };
    subscriptions.contains(caller);
  };

  public shared ({ caller }) func subscribe() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can subscribe");
    };
    if (subscriptions.contains(caller)) {
      Runtime.trap("User is already subscribed.");
    };
    subscriptions.add(caller);
  };

  public shared ({ caller }) func unsubscribe() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can unsubscribe");
    };
    if (not subscriptions.contains(caller)) {
      Runtime.trap("User is not subscribed.");
    };
    subscriptions.remove(caller);
  };

  // Comments - Requires authenticated user
  public shared ({ caller }) func postComment(videoId : VideoId, text : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can post comments");
    };
    if (not subscriptions.contains(caller)) {
      Runtime.trap("Unauthorized: Only subscribed users can comment");
    };

    switch (videos.get(videoId)) {
      case (null) { Runtime.trap("Video does not exist.") };
      case (?_) {
        let comment = {
          author = caller;
          text;
          timestamp = Time.now();
        };

        let currentComments = switch (comments.get(videoId)) {
          case (null) { [] : [Comment] };
          case (?existing) { existing };
        };

        comments.add(videoId, currentComments.concat([comment]));
      };
    };
  };

  public query ({ caller }) func getComments(videoId : VideoId) : async [Comment] {
    switch (comments.get(videoId)) {
      case (null) { [] };
      case (?videoComments) { videoComments };
    };
  };

  // Likes - Requires authenticated user
  public shared ({ caller }) func likeVideo(videoId : VideoId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can like videos");
    };

    switch (videos.get(videoId)) {
      case (null) { Runtime.trap("Video does not exist.") };
      case (?_) {
        let currentLikes = switch (likes.get(videoId)) {
          case (null) {
            let newSet = Set.empty<Principal>();
            likes.add(videoId, newSet);
            newSet;
          };
          case (?existing) { existing };
        };

        if (currentLikes.contains(caller)) {
          Runtime.trap("User has already liked this video.");
        };

        currentLikes.add(caller);
      };
    };
  };

  public shared ({ caller }) func unlikeVideo(videoId : VideoId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can unlike videos");
    };

    switch (videos.get(videoId)) {
      case (null) { Runtime.trap("Video does not exist.") };
      case (?_) {
        switch (likes.get(videoId)) {
          case (null) {
            Runtime.trap("User has not liked this video yet.");
          };
          case (?currentLikes) {
            if (not currentLikes.contains(caller)) {
              Runtime.trap("User has not liked this video yet.");
            };
            currentLikes.remove(caller);
          };
        };
      };
    };
  };

  public query ({ caller }) func getLikeCount(videoId : VideoId) : async Nat {
    switch (likes.get(videoId)) {
      case (null) { 0 };
      case (?currentLikes) { currentLikes.size() };
    };
  };
};
