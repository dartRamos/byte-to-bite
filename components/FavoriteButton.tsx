import React from 'react';
import { Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFavorites } from '../context/FavoritesContext' 
import { useUser } from '@clerk/clerk-expo';
import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api"


// Define the expected props 
type FavoriteButtonProps = {
  recipeId: number; 
  title?: string;
  imageUrl?: string;
};

const FavoriteButton = ({ recipeId, title, imageUrl }: FavoriteButtonProps) => {
  
  // Get the isFavorite checker and toggleFavorite function from context
  const { isFavorite, toggleFavorite, favorites } = useFavorites();
  const { user } = useUser();

  const convexUser = useQuery(api.users.getUserByClerkId, user?.id ? { clerkId: user.id } : "skip");

  // Mutation to insert and delete saved recipe
  const insertSavedRecipe = useMutation(api.functions.savedFavorites.insertSavedRecipe);
  const removeSavedRecipe = useMutation(api.functions.savedFavorites.removeSavedRecipe);
  

  // New toggleFavorite with mutation call
  const enhancedToggleFavorite = async (recipeId: number) => {
    if (!user || !convexUser) return; // Wait until both are loaded

    if (isFavorite(recipeId)) {
      // Call remove mutation to delete from DB
    await removeSavedRecipe({
      userId: convexUser?._id, // Use convexUser's DB id here, not Clerk user id
      recipeId,
    });
    toggleFavorite(recipeId); // update local state
  } else {
    // Call insert mutation
    await insertSavedRecipe({
      userId: convexUser?._id,
      recipeId,
      title: title || "",
      imageUrl: imageUrl || "",
      isFavorited: true,
    });
    toggleFavorite(recipeId);
  }
};

  return (
    <Pressable
      onPress={() => enhancedToggleFavorite(recipeId)}
      accessibilityLabel={isFavorite(recipeId) ? 'Remove from favorites' : 'Add to favorites'}
    >
      <Ionicons
        name={isFavorite(recipeId) ? 'heart' : 'heart-outline'}
        size={28}
        color={isFavorite(recipeId) ? 'tomato' : 'gray'}
      />
    </Pressable>
  );
};

export default FavoriteButton;