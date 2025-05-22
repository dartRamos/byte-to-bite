import { View, Text, Image, ScrollView } from 'react-native';
import { useUser } from '@clerk/clerk-expo';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';  // Adjust relative path

export default function Favorites() {
  const { user } = useUser();

  // Query to get Convex user by Clerk ID
  const convexUser = useQuery(
    api.users.getUserByClerkId,
    user?.id ? { clerkId: user.id } : "skip"
  );

  // Query to get favorites by Convex user ID
  const favorites = useQuery(
    api.functions.getFavoriteByUser.getFavoritesByUser,
    convexUser?._id ? { userId: convexUser._id } : "skip"
  );

  if (!favorites) {
    return (
      <View>
        <Text>Loading favorites...</Text>
      </View>
    );
  }

  if (favorites.length === 0) {
    return (
      <View>
        <Text>No favorites yet!</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      {favorites.map((recipe) => (
        <View key={recipe._id} style={{ marginBottom: 20 }}>
          <Image
            source={{ uri: recipe.imageUrl }}
            style={{ width: '100%', height: 200, borderRadius: 10 }}
          />
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 8 }}>
            {recipe.title}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
}