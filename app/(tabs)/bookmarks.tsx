import { View, Text, Image, ScrollView } from 'react-native';
import { useUser } from '@clerk/clerk-expo';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';  
import FavoriteRecipeCard from '@/components/FavoriteRecipeCard';


export default function Favorites() {
  const { user } = useUser();

  // Fetch Convex user by Clerk ID
  const convexUser = useQuery(
    api.users.getUserByClerkId,
    user?.id ? { clerkId: user.id } : "skip"
  );

  // Fetch favorites by Convex user ID
  const favorites = useQuery(
    api.functions.getFavoriteByUser.getFavoritesByUser,
    convexUser?._id ? { userId: convexUser._id } : "skip"
  );

  if (!favorites) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading favorites...</Text>
      </View>
    );
  }

  if (favorites.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>No favorites saved yet!</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      {favorites.map((recipe) => (
        <FavoriteRecipeCard key={recipe.recipeId} recipe={recipe} />
      ))}
    </ScrollView>
  );
}