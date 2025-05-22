import { Loader } from "@/components/Loader";
import MyPosts from "@/components/MyPosts";
import { COLORS } from "@/constants/theme";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { useQuery } from "convex/react";
import React from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { api } from "../../convex/_generated/api";

export default function UserProfile() {
  const { isLoaded, user } = useUser();
  const { signOut } = useAuth();

  const dbUser = useQuery(api.users.getUserByClerkId, {
    clerkId: user?.id ?? "",
  });

  const posts = useQuery(api.functions.posts.getFeedPost);

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
      {/* Header */}
      <View style={styles.profileHeader}>
        <TouchableOpacity style={styles.logoutButton} onPress={() => signOut()}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        <Image source={{ uri: dbUser.image }} style={styles.avatar} />
        <Text style={styles.name}>{dbUser.fullName}</Text>
      </View>

      {/* Posts or NoPostsFound */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ alignItems: "center", paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {posts.length === 0 ? (
          <NoPostsFound />
        ) : (
          posts.map((post) => <MyPosts key={post._id} post={post} />)
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  profileHeader: {
    alignItems: "center",
    paddingTop: 60,
    paddingBottom: 30,
    backgroundColor: "#121212",
  },
  name: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ffffff",
    marginTop: 16,
    textShadowColor: "#61dafb",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 5,
  },
  avatar: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 4,
    borderColor: "#61dafb",
    shadowColor: "#61dafb",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 10,
  },
  logoutButton: {
    position: "absolute",
    top: 20,
    right: 20,
    backgroundColor: "#ff4757",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    elevation: 4,
  },
  logoutText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
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

const NoPostsFound = () => (
  <View style={{ marginTop: 40, alignItems: "center" }}>
    <Text style={{ fontSize: 20, color: COLORS.primary }}>No posts yet</Text>
  </View>
);