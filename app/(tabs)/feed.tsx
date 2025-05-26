import React, { useRef } from "react";
import { Loader } from "@/components/Loader";
import { COLORS } from "@/constants/theme";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Dimensions, View, StyleSheet, Text, Animated } from "react-native";
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
    backgroundColor: "rgba(107, 76, 29, 1)",
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 35,
    fontFamily: "BoldPencil",
    color: "#e0b300",
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
});
