import { COLORS } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Image } from "expo-image";
import { useUser } from "@clerk/clerk-expo"
import { useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";

export default function MyPosts({ post }: { post: any }) {

  const { user } = useUser();

  const currentUser = useQuery(api.users.getUserByClerkId, user ? {
  clerkId: user?.id} : "skip");

  const deletePost = useMutation(api.functions.posts.deletePost)

  const handleDelete =  async () => {
    try {
      await deletePost({ postId: post._id });
    } catch (err) {
      console.error("Error deleting post:", err);
    }
  }

  return (
    <View style={styles.post}>
      <View style={styles.postHeader}>
        <Text style={styles.postTitle} numberOfLines={1} ellipsizeMode="tail">
          {post.title}
        </Text>
        <TouchableOpacity onPress={handleDelete}>
          <Ionicons name="trash-outline" size={20} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <Image
        source={post.imageUrl}
        style={styles.postImage}
        contentFit="cover"
        transition={200}
        cachePolicy="memory-disk"
      />

      <View style={styles.captionContainer}>
        {post.caption && <Text style={styles.captionText}>{post.caption}</Text>}
      </View>
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
  postTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.white,
    flex: 1,
    textAlign: "left",
    marginRight: 10,
  },
  postImage: {
    width: width,
    height: width,
  },
  captionContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 6,
    paddingHorizontal: 12,
  },
  captionText: {
    fontSize: 14,
    color: COLORS.white,
    flex: 1,
  },
});
