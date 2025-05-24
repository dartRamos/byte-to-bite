import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFavorites } from '../context/FavoritesContext' 


type FavoriteButtonProps = {
  recipeId: number;
  title: string;
  imageUrl: string;
};

const FavoriteButton = ({ recipeId, title, imageUrl }: FavoriteButtonProps) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorited = isFavorite(recipeId);

  return (
    <Pressable
      onPress={() => toggleFavorite(recipeId, title, imageUrl)}
      style={({ pressed }) => [
        styles.button,
        pressed && styles.pressed,
      ]}
      accessibilityLabel={favorited ? `Unfavorite ${title}` : `Favorite ${title}`}
      accessibilityRole="button"
    >
      <Ionicons
        name={favorited ? 'heart' : 'heart-outline'}
        size={28}
        color={favorited ? '#ff6b6b' : '#444'}
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.7,
  },
});

export default FavoriteButton;