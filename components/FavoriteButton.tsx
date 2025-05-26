import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
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
       <View style={styles.content}>
        <Text style={styles.text}>
          {favorited ? 'Recipe saved!' : 'Save this recipe'}
        </Text>
        <Ionicons
          name={favorited ? 'heart' : 'heart-outline'}
          size={28}
          color={favorited ? '#ff6b6b' : '#444'}
        />
        
      </View>
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
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  text: {
    marginTop: 4,
    fontSize: 10, 
    color: '#666',
    textAlign: 'center',
    fontFamily: 'Pencil', 
  },

});


export default FavoriteButton;