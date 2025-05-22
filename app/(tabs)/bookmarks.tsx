import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useUser } from '@clerk/clerk-expo';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';  
import FavoriteRecipeCard from '@/components/FavoriteRecipeCard';
import FullFavoriteRecipeModal from '@/components/FullFavoriteRecipeModal';  // import your modal



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

  type SavedRecipe = {
  _id: string;  // or your specific Id type
  _creationTime: number;
  userId: string;  // or your specific Id type
  recipeId: number;
  title: string;
  imageUrl: string;
  isFavorited: boolean;
};

  // State for modal
  const [selectedRecipe, setSelectedRecipe] = useState<SavedRecipe | null>(null);
  const [isModalVisible, setModalVisible] = useState(false);

  // Open modal handler
  const openFullRecipe = (recipeId: number) => {
  const recipe = favorites?.find(r => r.recipeId === recipeId);
  if (!recipe) return;

  setSelectedRecipe(recipe);
  setModalVisible(true);
};



  // Close modal handler
  const closeModal = () => {
    setModalVisible(false);
    setSelectedRecipe(null);
  };

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
    <>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={{
          fontSize: 24,
          fontWeight: 'bold',
          marginBottom: 16,
          color: '#333',
          textAlign: 'center',
        }}>
          All favorite Recipes
        </Text>

        {favorites?.map((recipe) => (
          <FavoriteRecipeCard
            key={recipe.recipeId}
            recipe={recipe}
            onViewFullRecipe={openFullRecipe}  // pass the handler 
          />
        ))}
      </ScrollView>

      {/* Full recipe modal */}
      <FullFavoriteRecipeModal
        isVisible={isModalVisible}
        recipe={selectedRecipe}
        onClose={closeModal}
      />
    </>
  );
}