import { Loader } from "@/components/Loader";
import MyPosts from "@/components/MyPosts";
import { COLORS } from "@/constants/theme";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { useQuery } from "convex/react";
import React from "react";
import {ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View,
} from "react-native";
import { api } from "../../convex/_generated/api";
import { Ionicons } from "@expo/vector-icons";

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
      <View style={styles.profileHeader}>
        <Pressable style={styles.logoutButton}onPress={() => signOut()}>
          <Ionicons name="log-out" size={40} color={"#E53935"} />
        </Pressable>

        <Image source={{ uri: dbUser.image }} style={styles.avatar} />
        <Text style={styles.name}>{dbUser.fullName}</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ alignItems: "center", paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
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
    backgroundColor: "#fff8c4",
    paddingHorizontal: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "#ff7043",
    shadowColor: "#61dafb",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 8,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333333",
    marginLeft: 20, 
    textShadowColor: "#f8bbd0",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 5,
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



const NoPostsFound = () => (
  <View style={{ marginTop: 40, alignItems: "center" }}>
    <Text style={{ fontSize: 20, color: COLORS.primary }}>No posts yet</Text>
  </View>
);