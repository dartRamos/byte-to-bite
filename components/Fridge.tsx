import { View, Image, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useUser } from '@clerk/clerk-expo';
import { useAction, useQuery } from 'convex/react';
import { api } from '../convex/_generated/api';
import React, {useState} from 'react';
import { COLORS } from '@/constants/theme';

import FullFavoriteRecipeModal from './FullFavoriteRecipeModal';


export default function Fridge() {
  const { user } = useUser();

  const [selectedRecipeId, setSelectedRecipeId] = useState<number | null>(null);
  const [fullRecipeDetails, setFullRecipeDetails] = useState<any | null>(null);
  const [isModalVisible, setModalVisible] = useState(false);

  const fetchRecipeById = useAction(api.functions.fetchRecipeByRecipeId.fetchRecipeById);


  const currentUser = useQuery(
    api.users.getUserByClerkId,
    user?.id ? { clerkId: user.id } : 'skip'
  );

  const favorites = useQuery(
    api.functions.getFavoriteByUser.getFavoritesByUser,
    currentUser?._id ? { userId: currentUser._id } : 'skip'
  );

  const imagePositions = [
    { top: 437, left: 125 },
    { top: 414, left: 262 },
    { top: 577, left: 102 },
    { top: 590, left: 257 },
    { top: 707, left: 171 },
  ];

  if (!favorites) {
    return 
  }

  const openFullRecipe = async (recipeId: number) => {
    try {
      const fullRecipe = await fetchRecipeById({ id: recipeId });
      setFullRecipeDetails(fullRecipe);
      setSelectedRecipeId(recipeId);
      setModalVisible(true);

    } catch (error) {
      console.error('Failed to fetch full recipe details', error);
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedRecipeId(null);
  };

  return (
    <View style={styles.container}>
      <View style={styles.fridgeWrapper}>
        <Image
          source={require('../assets/images/fullfridge.png')}
          style={styles.fridge}
        />


        {favorites.slice(0, 5).map((recipe, index) => {
          const position = imagePositions[index];
          return (
            <TouchableOpacity
              key={recipe._id}
              onPress={() => openFullRecipe(recipe.recipeId)}
              style={[styles.recipeImageWrapper, position]}
              activeOpacity={0.8}>
              <Image
                source={{ uri: recipe.imageUrl }}
                style={[styles.recipeImage]}
              />
            </TouchableOpacity>
          );
        })}
  
        <Image 
          source={require('../assets/images/magnets.png')}
          style={styles.magnets}
        />

        <FullFavoriteRecipeModal
          isVisible={isModalVisible}
          recipe={fullRecipeDetails}
          onClose={closeModal}
        />
      </View>
    </View>
  );
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    paddingVertical: 20,
  },
  fridgeWrapper: {
    position: 'relative',
    width: 435,
    height: 900,
  },
  fridge: {
    width: '100%',
    height: '100%',
  },
  recipeImage: {
    width: 80,
    height: 80,
    position: 'absolute',
    borderRadius: 8,
  },
  magnets: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 435,
    height: 900,
    zIndex: 20,
    pointerEvents: 'none', // allow touch events to pass through
  },
  recipeImageWrapper: {
    position: 'absolute',
    width: 80,
    height: 80,
    zIndex: 10, 
  }
});