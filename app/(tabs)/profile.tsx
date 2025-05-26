import { Loader } from "@/components/Loader";
import { COLORS } from "@/constants/theme";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "convex/react";
import { Image } from "expo-image";
import React from "react";
import {
  ActivityIndicator, Pressable, ScrollView, StyleSheet, Text,
  View
} from "react-native";
import { api } from "../../convex/_generated/api";

export default function UserProfile() {
  const { isLoaded, user } = useUser();
  const { signOut } = useAuth();

  const dbUser = useQuery(api.users.getUserByClerkId, {
    clerkId: user?.id ?? "",
  });

  const posts = useQuery(api.functions.posts.getFeedPost);
  const bookmarkedPosts = useQuery(api.functions.bookmarks.getBookmarkedPosts)

  if (bookmarkedPosts === undefined) return <Loader />;
  if (posts === undefined) return <Loader />;

  if (!isLoaded || dbUser === undefined) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text>Loading profile...</Text>
      </View>
    );
  }

  if (dbUser === null) {
    return (
      <View style={styles.centered}>
        <Text>User not found in database.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.profileHeader}>
        <Pressable style={styles.logoutButton}onPress={() => signOut()}>
          <Ionicons name="log-out" size={40} color={"#e0b300"} />
        </Pressable>

        <Image source={{ uri: dbUser.image }} style={styles.avatar} />
        <Text style={styles.name}>{dbUser.fullname}</Text>
      </View>

      <ScrollView
        contentContainerStyle={{
          padding: 8,
          flexDirection: "row",
          flexWrap: "wrap"
        }}
      >
        {bookmarkedPosts.length === 0 ? (
          <NoBookmarksFound />
        ) : (
          bookmarkedPosts.map((post) => {
            if (!post) return null;
            return (
              <View key={post._id} style={{ width: "33.33%", padding: 1 }}>
                <Image
                  source={post.imageUrl}
                  style={{ width: "100%", aspectRatio: 1 }}
                  contentFit="cover"
                  transition={200}
                  cachePolicy="memory-disk"
                />
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fffde7",
  },
  profileHeader: {
    flexDirection: "row", 
    alignItems: "center", 
    paddingTop: 40,
    paddingBottom: 20,
    backgroundColor: "rgba(107, 76, 29, 1)",
    paddingHorizontal: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "#e0b300",
    shadowColor: "#61dafb",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 8,
  },
  name: {
    fontSize: 30,
    color: "#e0b300",
    marginLeft: 20, 
    textShadowColor: "#f8bbd0",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 5,
    fontFamily: "BoldPencil",
  },
  logoutButton: {
    backgroundColor: "transparent",
    borderRadius: 20,
    padding: 8,
    position: "absolute",
    top: 20,
    right: 20,
  },
  scroll: {
    flex: 1,
    paddingHorizontal: 20,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121212",
  },
});

function NoBookmarksFound() {
  return (
    <View style={{
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#fffde7",
      width: "100%",
      height: 500,
    }}>
      <Text style={{ fontSize: 22, color: "#ff7043", fontFamily: 'Pencil'}}>No bookmarked recipes yet</Text>
    </View>
  );
}