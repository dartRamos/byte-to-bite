import { Loader } from "@/components/Loader";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "convex/react";
import { Image } from "expo-image";
import React from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { api } from "../../convex/_generated/api";
import UserRecipeModal from "@/components/UserRecipeModal";

export default function UserProfile() {
  const { isLoaded, user } = useUser();
  const { signOut } = useAuth();

  const [showRecipeModal, setShowRecipeModal] = React.useState(false);
  const [selectedPost, setSelectedPost] = React.useState(null);

  const dbUser = useQuery(api.users.getUserByClerkId, {
    clerkId: user?.id ?? "",
  });

  const bookmarkedPosts = useQuery(api.functions.bookmarks.getBookmarkedPosts);

  if (bookmarkedPosts === undefined) return <Loader />;

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

  function onRecipePress(post?: any) {
    setSelectedPost(post);
    setShowRecipeModal(true);
  }

  return (
    <View style={styles.container}>
      <View style={styles.profileHeader}>
        <Pressable style={styles.logoutButton} onPress={() => signOut()}>
          <Ionicons name="log-out" size={40} color={"#e0b300"} />
        </Pressable>

        <Image source={{ uri: dbUser.image }} style={styles.avatar} />
        <Text style={styles.name}>{dbUser.fullname}</Text>
      </View>

      <ScrollView
        contentContainerStyle={{
          padding: 8,
          flexDirection: "row",
          flexWrap: "wrap",
        }}
      >
        {bookmarkedPosts.map((post) => {
          if (!post) return null;
          const isRecipe = post.isRecipe;

          return (
            <Pressable
              key={post._id}
              style={styles.postContainer}
              onPress={() => isRecipe && onRecipePress(post)}
              disabled={!isRecipe}
            >
              <Image
                source={post.imageUrl}
                style={styles.postImage}
                contentFit="cover"
                transition={200}
                cachePolicy="memory-disk"
              />
              {isRecipe && (
                <View style={styles.recipeLabel}>
                  <Text style={styles.recipeText}>Recipe!</Text>
                </View>
              )}
            </Pressable>
          );
        })}
      </ScrollView>

      {selectedPost && (
        <UserRecipeModal
          visible={showRecipeModal}
          onClose={() => setShowRecipeModal(false)}
          post={selectedPost}
        />
      )}
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
  postContainer: {
    width: "33.33%",
    padding: 1,
  },
  postImage: {
    width: "100%",
    aspectRatio: 1,
    position: "relative",
  },
  recipeLabel: {
    position: "absolute",
    top: 5,
    left: 5,
    backgroundColor: "#e0b300",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 5,
    zIndex: 10,
  },
  recipeText: {
    color: "#4b2e00",
    fontWeight: "bold",
    fontFamily: "BoldPencil",
    fontSize: 12,
  },
});