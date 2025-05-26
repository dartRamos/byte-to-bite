import { COLORS } from "@/constants/theme";
import { Id } from "@/convex/_generated/dataModel";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery } from "convex/react";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { useState } from "react";
import {
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { api } from "../convex/_generated/api";
import { useUser } from "@clerk/clerk-expo";
import CommentsModal from "./CommentsModal";
import { formatDistanceToNow } from "date-fns";

type PostProps = {
  post: {
    comments: number;
    _id: Id<"posts">;
    imageUrl: string;
    title?: string;
    caption?: string;
    isLiked: boolean;
    isBookmarked: boolean;
    _creationTime: number;
    author: {
      _id: Id<"users">;
      username: string;
      image: string;
    };
  };
};

export default function MyPosts({ post }: PostProps) {
  const { user } = useUser();
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [showComments, setShowComments] = useState(false);
  const [commentsCount, setCommentsCounts] = useState(post.comments);
  const [isBookedmarked, setIsBookedmarked] = useState(post.isBookmarked);

  const currentUser = useQuery(
    api.users.getUserByClerkId,
    user ? { clerkId: user.id } : "skip"
  );
  const toggleLike = useMutation(api.functions.posts.toggleLike);
  const deletePost = useMutation(api.functions.posts.deletePost);
  const toggleBookmark = useMutation(api.functions.bookmarks.toggleBookmark);

  const handleLike = async () => {
    try {
      const newIsLike = await toggleLike({ postId: post._id });
      setIsLiked(newIsLike);
    } catch (err) {
      console.error("Error liking post:", err);
    }
  };

  const handleDelete = async () => {
    try {
      await deletePost({ postId: post._id });
    } catch (err) {
      console.error("Error deleting post:", err);
    }
  };

  const handleBookmark = async () => {
      const newIsBookedmarked = await toggleBookmark({ postId: post._id });
      setIsBookedmarked(newIsBookedmarked);
 }

  return (
    <View style={styles.post}>
      <View style={styles.postHeader}>
        <View style={styles.userInfo}>
          <Link href={"/(tabs)/feed"} asChild>
            <TouchableOpacity>
              <Image
                source={post.author.image}
                style={styles.postAvatar}
                contentFit="cover"
                transition={200}
                cachePolicy="memory-disk"
              />
            </TouchableOpacity>
          </Link>
          <Text style={styles.postUsername}>{post.author.username}</Text>
        </View>

        <View style={styles.postHeaderLeft}>
          {post.author._id === currentUser?._id ? (
            <TouchableOpacity onPress={handleDelete}>
              <Ionicons name="trash-outline" size={20} color={"#ff7043"} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity>
              <Ionicons name="ellipsis-horizontal" size={20} color={"#ff7043"} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <Image
        source={post.imageUrl}
        style={styles.postImage}
        contentFit="cover"
        transition={200}
        cachePolicy="memory-disk"
      />

      <View style={styles.postActions}>
        <View style={styles.postActionsLeft}>
          <TouchableOpacity onPress={handleLike}>
            <Ionicons
              name={isLiked ? "heart" : "heart-outline"}
              size={24}
              color={"#ff7043"}
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setShowComments(true)}>
            <Ionicons name="chatbubble-outline" size={24} color={"#ff7043"} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={handleBookmark}>
          <Ionicons
            name={isBookedmarked ? "bookmark" : "bookmark-outline"}
            size={24}
            color={"#ff7043"}
          />
        </TouchableOpacity>
      </View>

      {post.title && (
        <View style={styles.postInfo}>
          <View style={styles.captionContainer}>
            <Text style={styles.captionText}>{post.title}</Text>
          </View>
        </View>
      )}

      {commentsCount > 0 && 
        <TouchableOpacity onPress={() => setShowComments(true)}>
          <Text style={styles.commentsText}>View all {commentsCount} comment(s)</Text>
        </TouchableOpacity>
      }

      <Text style={styles.timeAgo}>
        {formatDistanceToNow(post._creationTime, {addSuffix: true})}
      </Text>

      <CommentsModal 
        postId={post._id}
        visible={showComments}
        onClose={() => setShowComments(false)}
        onCommentAdded={() => setCommentsCounts((prev) => prev + 1)}
      />
    </View>
  );
}

const { width } = Dimensions.get("window");

export const styles = StyleSheet.create({
  post: {
    marginBottom: 16,
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  postHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  postAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  postUsername: {
    fontSize: 14,
    color: "#ff7043",
    fontFamily: 'Pencil',
    textShadowColor: "rgba(0,0,0,0.2)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1
  },
  postImage: {
    width: width * 0.95,
    height: width * 0.95,
    alignSelf: 'center',
  

  },
  postActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  postActionsLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  postInfo: {
    paddingHorizontal: 12,
  },
  captionContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 6,
  },
  captionText: {
    fontSize: 24,
    color: "#ff3d00",
    flex: 1,
    fontFamily: 'BoldPencil',
    textShadowColor: "rgba(0,0,0,0.2)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  commentsText: {
    fontSize: 11,
    color: COLORS.grey,
    marginBottom: 2,
    fontFamily: 'Pencil',
    left: 13,
    textShadowColor: "rgba(0,0,0,0.2)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1
  },
  timeAgo: {
    fontSize: 11,
    color: COLORS.grey,
    left: 13,
    marginBottom: 10,
    fontFamily: 'Pencil',
    textShadowColor: "rgba(0,0,0,0.2)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1
  },
});
