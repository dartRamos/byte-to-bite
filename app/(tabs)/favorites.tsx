import FavoriteRecipeCard from '../../components/FavoriteRecipeCard';
import FullFavoriteRecipeModal from '../../components/FullFavoriteRecipeModal';
import { useUser } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { useQuery, useAction } from 'convex/react';
import React, { useState } from 'react';
import {
  ScrollView,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView
} from 'react-native';
import { api } from '../../convex/_generated/api';
import { useNavigation } from '@react-navigation/native';

export default function Favorites() {
  const navigation = useNavigation();

  const { user } = useUser();

  const convexUser = useQuery(
    api.users.getUserByClerkId,
    user?.id ? { clerkId: user.id } : 'skip'
  );

  const favorites = useQuery(
    api.functions.getFavoriteByUser.getFavoritesByUser,
    convexUser?._id ? { userId: convexUser._id } : 'skip'
  );

  const [selectedRecipeId, setSelectedRecipeId] = useState<number | null>(null);
  const [fullRecipeDetails, setFullRecipeDetails] = useState<any | null>(null);
  const [isModalVisible, setModalVisible] = useState(false);

  const fetchRecipeById = useAction(api.functions.fetchRecipeByRecipeId.fetchRecipeById);

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
    setFullRecipeDetails(null);
  };

  if (!favorites) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading favorites...</Text>
      </View>
    );
  }

  if (favorites.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No favorites saved yet!</Text>
        <Ionicons name="heart-dislike" size={50} color={'white'} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>All Favorite Recipes</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {favorites.map((recipe) => (
          <FavoriteRecipeCard
            key={recipe.recipeId}
            recipe={recipe}
            onViewFullRecipe={() => openFullRecipe(recipe.recipeId)}
          />
        ))}

        {/* Back to Home Button */}
        <TouchableOpacity
          style={styles.backToHomeButton}
          onPress={() => navigation.navigate('index')}
        >
          <Text style={styles.backToHomeButtonText}>Back to Home</Text>
        </TouchableOpacity>
      </ScrollView>

      <FullFavoriteRecipeModal
        isVisible={isModalVisible}
        recipe={fullRecipeDetails}
        onClose={closeModal}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 10,
    backgroundColor: 'rgba(0,0,0,0.8)',
    zIndex: 10,
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  scrollView: {
    backgroundColor: '#121212',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#121212',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: '#121212',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12,
  },
  backToHomeButton: {
    marginVertical: 20,
    alignSelf: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'white',
  },

  backToHomeButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
});
