import { View, Image, StyleSheet, Text } from 'react-native';
import { useUser } from '@clerk/clerk-expo';
import { useQuery } from 'convex/react';
import { api } from '../convex/_generated/api';
import React from 'react';

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
    { top: 419, left: 105 },
    { top: 420, left: 289 },
    { top: 567, left: 85 },
    { top: 589, left: 286 },
    { top: 699, left: 165 },
  ];

  if (!favorites) {
    return 
  }

  return (
    <View style={styles.container}>
      <View style={styles.fridgeWrapper}>
        <Image
          source={require('../assets/images/fridgemobile.png')}
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
      </View>
    </View>
  );
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF8C4",
    alignItems: 'center',
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
    height: 90,
    position: 'absolute',
    borderRadius: 8,
  },
});
