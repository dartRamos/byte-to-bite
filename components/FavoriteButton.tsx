import React from 'react';
import { Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFavorites } from '../context/FavoritesContext' 

// Define the expected props 
type FavoriteButtonProps = {
  recipeId: string; // The unique ID of the recipe to toggle favorite status
};

const FavoriteButton = ({ recipeId }: FavoriteButtonProps) => {

  // Get the isFavorite checker and toggleFavorite function from context
  const { isFavorite, toggleFavorite } = useFavorites();

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