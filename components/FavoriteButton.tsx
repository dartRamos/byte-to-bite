import React from 'react';
import { Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFavorites } from '../context/FavoritesContext' 
import { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-expo';
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api"
import { useMutation } from "convex/react";


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

  // Mutation to insert saved recipe
  const insertSavedRecipe = useMutation(api.functions.savedFavorites.insertSavedRecipe);
  

  // New toggleFavorite with mutation call
  const enhancedToggleFavorite = async (recipeId: number) => {
    if (!user || !convexUser) return; // Wait until both are loaded

    if (isFavorite(recipeId)) {
      // TODO: call mutation to remove favorite from DB (we’ll add this later)
      toggleFavorite(recipeId); // remove locally
    } else {
      // Call mutation to save favorite to DB
      await insertSavedRecipe({
        userId: convexUser._id, 
        recipeId,
        title: title || "",
        imageUrl: imageUrl || "",
        isFavorited: true,
      });
      toggleFavorite(recipeId); // update locally
    }
  };

  //REMOVE THIS USEFFECT AFTER DEBUGING
  // Log the favorites array whenever it changes
  useEffect(() => {
    console.log('Current Favorite Recipes:', favorites);
  }, [favorites]);


  

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