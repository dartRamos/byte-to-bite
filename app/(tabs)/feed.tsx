import React, { useRef } from "react";
import { Loader } from "@/components/Loader";
import { COLORS } from "@/constants/theme";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Dimensions, View, StyleSheet, Text, Animated, Platform } from "react-native";
import MyPosts from "@/components/MyPosts";

const { width, height } = Dimensions.get("window");
const LINE_SPACING = 32;

export default function Feed() {
  const posts = useQuery(api.functions.posts.getFeedPost);
  const scrollY = useRef(new Animated.Value(0)).current;

  if (posts === undefined) return <Loader />;

  const numberOfLines = Math.ceil(height / LINE_SPACING) + 50;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Shared Recipes</Text>
      </View>

      <Animated.View
        style={[
          styles.linesBackground,
          {
            transform: [{ translateY: Animated.multiply(scrollY, -1) }],
          },
        ]}
        pointerEvents="none"
      >
        {Array.from({ length: numberOfLines }).map((_, i) => (
          <View key={i} style={[styles.line, { top: i * LINE_SPACING }]} />
        ))}
      </Animated.View>

      <Animated.FlatList
        data={posts}
        renderItem={({ item }) => <MyPosts post={item} />}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 600, paddingTop: 0 }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fffde7",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surface,
    backgroundColor: "#fff8c4",
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: "Pencil",
    color: "#ff7043",
  },
  linesBackground: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 8,
    height: height * 10,
    backgroundColor: "transparent",
    zIndex: 0,
  },
  line: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: "black",
    opacity: 0.3,
  },
  storiesContainer: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surface,
  },
  storyWrapper: {
    alignItems: "center",
    marginHorizontal: 8,
    width: 72,
  },
  storyRing: {
    width: 68,
    height: 68,
    borderRadius: 34,
    padding: 2,
    backgroundColor: COLORS.background,
    borderWidth: 2,
    borderColor: COLORS.primary,
    marginBottom: 4,
  },
  noStory: {
    borderColor: COLORS.grey,
  },
  storyAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: COLORS.background,
  },
  storyUsername: {
    fontSize: 11,
    color: COLORS.white,
    textAlign: "center",
  },
  post: {
    marginBottom: 16,
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
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
    fontWeight: "600",
    color: COLORS.white,
  },
  postImage: {
    width: width,
    height: width,
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
  likesText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.white,
    marginBottom: 6,
  },
  captionContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 6,
  },
  captionUsername: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.white,
    marginRight: 6,
  },
  captionText: {
    fontSize: 14,
    color: COLORS.white,
    flex: 1,
  },
  commentsText: {
    fontSize: 14,
    color: COLORS.grey,
    marginBottom: 4,
  },
  timeAgo: {
    fontSize: 12,
    color: COLORS.grey,
    marginBottom: 8,
  },
  modalContainer: {
    backgroundColor: COLORS.background,
    marginBottom: Platform.OS === "ios" ? 44 : 0,
    flex: 1,
    marginTop: Platform.OS === "ios" ? 44 : 0,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    height: 56,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.surface,
  },
  modalTitle: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "600",
  },
  commentsList: {
    flex: 1,
  },
  commentContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.surface,
  },
  commentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
  },
  commentContent: {
    flex: 1,
  },
  commentUsername: {
    color: COLORS.white,
    fontWeight: "500",
    marginBottom: 4,
  },
  commentText: {
    color: COLORS.white,
    fontSize: 14,
    lineHeight: 20,
  },
  commentTime: {
    color: COLORS.grey,
    fontSize: 12,
    marginTop: 4,
  },
  commentInput: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 0.5,
    borderTopColor: COLORS.surface,
    backgroundColor: COLORS.background,
  },
  input: {
    flex: 1,
    color: COLORS.white,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 12,
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    fontSize: 14,
  },
  postButton: {
    color: COLORS.primary,
    fontWeight: "600",
    fontSize: 14,
  },
  postButtonDisabled: {
    opacity: 0.5,
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
});