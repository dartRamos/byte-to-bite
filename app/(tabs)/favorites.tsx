import FavoriteRecipeCard from '@/components/FavoriteRecipeCard';
import FullFavoriteRecipeModal from '@/components/FullFavoriteRecipeModal';
import { COLORS } from '@/constants/theme';
import { useUser } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { useQuery, useMutation, useAction } from 'convex/react';
import React, { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { api } from '../../convex/_generated/api';

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
    _id: string;
    _creationTime: number;
    userId: string;
    recipeId: number;
    title: string;
    imageUrl: string;
    isFavorited: boolean;
  };

  // State for modal and full recipe details from Spoonacular
  const [selectedRecipeId, setSelectedRecipeId] = useState<number | null>(null);
  const [fullRecipeDetails, setFullRecipeDetails] = useState<any | null>(null);
  const [isModalVisible, setModalVisible] = useState(false);

  // Mutation to fetch full recipe info from Spoonacular API
  const fetchRecipeById = useAction(api.functions.fetchRecipeByRecipeId.fetchRecipeById);

  // Open modal handler
  const openFullRecipe = async (recipeId: number) => {
    try {
      // Fetch full recipe details from API
      const fullRecipe = await fetchRecipeById({ id: recipeId });
      setFullRecipeDetails(fullRecipe);
      setSelectedRecipeId(recipeId);
      setModalVisible(true);
    } catch (error) {
      console.error("Failed to fetch full recipe details", error);
    }
  };

  // Close modal handler
  const closeModal = () => {
    setModalVisible(false);
    setSelectedRecipeId(null);
    setFullRecipeDetails(null);
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
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#121212' }}>
        <Text style={{ fontSize: 18, fontWeight: "600", color: COLORS.white }}>
          No favorites saved yet!
        </Text>
        <Ionicons name="heart-dislike" size={50} color={"white"} />
      </View>
    );
  }

  return (
    <>
      <ScrollView style={{ backgroundColor: '#121212' }}>
        <View>
          <Text
            style={{
              fontSize: 24,
              fontWeight: 'bold',
              marginBottom: 16,
              color: '#fff',
              textAlign: 'center',
            }}
          >
            All Favorite Recipes
          </Text>

          {favorites.map((recipe) => (
            <FavoriteRecipeCard
              key={recipe.recipeId}
              recipe={recipe}
              onViewFullRecipe={() => openFullRecipe(recipe.recipeId)}
            />
          ))}
        </View>
      </ScrollView>

      <FullFavoriteRecipeModal
        isVisible={isModalVisible}
        recipe={fullRecipeDetails}
        onClose={closeModal}
      />
    </>
  );
}
