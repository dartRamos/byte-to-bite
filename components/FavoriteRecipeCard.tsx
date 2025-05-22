import React from 'react';
import { View, Text, Image, Pressable, StyleSheet, Alert } from 'react-native';

type RecipeCardProps = {
  recipe: {
    recipeId: number;
    title: string;
    imageUrl: string;
  };
};

const FavoriteRecipeCard = ({ recipe }: RecipeCardProps) => {
  return (
    <View style={styles.card}>
      <Image source={{ uri: recipe.imageUrl }} style={styles.image} />
      <Text style={styles.title}>{recipe.title}</Text>

      <Pressable
        style={styles.viewButton}
        onPress={() => Alert.alert('Button pressed!', `Recipe ID: ${recipe.recipeId}`)}
      >
        <Text style={styles.viewButtonText}>View Full Recipe</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 3,
    padding: 12,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 12,
  },
  viewButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 5,
  },
  viewButtonText: {
    color: 'white',
    fontWeight: '600',
  },
});

export default FavoriteRecipeCard;