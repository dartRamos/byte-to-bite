import React from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import FavoriteButton from './FavoriteButton';

type RecipeCardProps = {
  recipe: {
    recipeId: number;
    title: string;
    imageUrl: string;
  };
  onViewFullRecipe: (recipeId: number) => void;  
};

const FavoriteRecipeCard = ({ recipe, onViewFullRecipe }: RecipeCardProps) => {
  return (
    <View style={styles.card}>
      <Image source={{ uri: recipe.imageUrl }} style={styles.image} />

      <Text style={styles.title}>{recipe.title}</Text>

      <View style={styles.buttonsRow}>
        <Pressable
          style={({ pressed }) => [
            styles.viewButton,
            pressed && styles.viewButtonPressed,
          ]}
          onPress={() => onViewFullRecipe(recipe.recipeId)}
        >
          <Text style={styles.viewButtonText}>View Full Recipe</Text>
        </Pressable>

        <FavoriteButton 
          recipeId={recipe.recipeId} 
          title={recipe.title} 
          imageUrl={recipe.imageUrl} 
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 20,
    backgroundColor: '#fffde7',
    borderRadius: 20,
    overflow: 'hidden',
    padding: 20,
    borderWidth: 2,
    borderColor: '#fbc02d',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 6,
  },
  image: {
    width: '100%',
    height: 220,
    borderRadius: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ff7043',
    marginVertical: 16,
  },
  buttonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  viewButton: {
    borderWidth: 1,
    borderColor: '#bbb',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 5,
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  viewButtonPressed: {
    backgroundColor: '#eee',
    borderColor: '#999',
  },
  viewButtonText: {
    color: '#666',
    fontWeight: '600',
    fontSize: 14,
  },
});

export default FavoriteRecipeCard;
