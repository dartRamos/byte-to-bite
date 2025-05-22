import React from "react";
import { View, Text, Image, ActivityIndicator, StyleSheet, TouchableOpacity } from "react-native";
import { useUser, useAuth } from "@clerk/clerk-expo";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function UserProfile() {
  const { isLoaded, user } = useUser();
  const { signOut } = useAuth();

  const dbUser = useQuery(
    api.users.getUserByClerkId,
    { clerkId: user?.id ?? "" }
  );

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
      <Image source={{ uri: dbUser.image }} style={styles.avatar} />
      <Text style={styles.name}>{dbUser.fullName}</Text>
      <TouchableOpacity style={styles.logoutButton} onPress={() => signOut()}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  name: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 20,
    textShadowColor: "#61dafb",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  avatar: {
    width: 240,
    height: 240,
    borderRadius: 30,
    borderWidth: 4,
    borderColor: "#61dafb",
    shadowColor: "#61dafb",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.8,
    shadowRadius: 25,
    elevation: 15,
  },
  logoutButton: {
    position: "absolute",
    top: 50,
    left: 20,
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
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121212",
  },
});
