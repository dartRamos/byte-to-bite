import { View, Image, StyleSheet, Text } from 'react-native';
import { useUser } from '@clerk/clerk-expo';
import { useQuery } from 'convex/react';
import { api } from '../convex/_generated/api';
import React from 'react';
import { COLORS } from '@/constants/theme';

export default function Fridge() {
  const { user } = useUser();

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
            <Image
              key={recipe._id}
              source={{ uri: recipe.imageUrl }}
              style={[styles.recipeImage, position]}
            />
          );
        })}
  
        <Image 
          source={require('../assets/images/magnets.png')}
          style={styles.magnets}
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
    zIndex: 10,
  },
});
