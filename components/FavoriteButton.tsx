import React from 'react';
import { Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFavorites } from '../context/FavoritesContext' 
import { useEffect } from 'react';

// Define the expected props 
type FavoriteButtonProps = {
  recipeId: string; // The unique ID of the recipe to toggle favorite status
};



const FavoriteButton = ({ recipeId }: FavoriteButtonProps) => {
  
  // Get the isFavorite checker and toggleFavorite function from context
  const { isFavorite, toggleFavorite, favorites } = useFavorites();

  //REMOVE THIS USEFFECT AFTER DEBUGING
  // Log the favorites array whenever it changes
  useEffect(() => {
    console.log('Current Favorite Recipes:', favorites);
  }, [favorites]);

  return (
    <Pressable
      onPress={() => toggleFavorite(recipeId)}
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