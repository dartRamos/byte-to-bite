import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import FavoriteButton from './FavoriteButton';

type Recipe = {
  image: string;
  title: string;
  id: number;
};

type RecipesModalProps = {
  isVisible: boolean;
  recipes: Recipe[];
  onClose: () => void;
  onSelectRecipe: (id: number) => void;
};

const RecipesModal = ({ isVisible, recipes, onClose, onSelectRecipe }: RecipesModalProps) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="arrow-back" size={28} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Back to Ingredients</Text>
        </View>

        <View style={styles.modalContent}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {recipes.slice(0, 5).map((recipe) => (
              <View key={recipe.id} style={styles.card}>
                <Image source={{ uri: recipe.image }} style={styles.image} />
                <Text style={styles.title}>{recipe.title}</Text>
                <View style={styles.actions}>
                  <TouchableOpacity
                    style={styles.viewButton}
                    onPress={() => onSelectRecipe(recipe.id)}
                  >
                    <Text style={styles.viewButtonText}>View Full Recipe</Text>
                  </TouchableOpacity>
                  
                  <FavoriteButton
                    recipeId={recipe.id}
                    title={recipe.title}
                    imageUrl={recipe.image}
                  />
                </View>
                
                
                
              </View>
              
            ))}
          </ScrollView>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 10,
    backgroundColor: 'rgba(0,0,0,0.8)',
    zIndex: 10,
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  modalContent: {
    flex: 1,
    margin: 20,
  },
  card: {
    marginBottom: 20,
    backgroundColor: '#fffde7',
    borderRadius: 20,
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
  viewButton: {
    borderWidth: 1,
    borderColor: '#bbb',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 5,
    alignSelf: 'flex-start',
  },
  viewButtonText: {
    color: '#666',
    fontWeight: '600',
    fontSize: 14,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center', // ensures vertical alignment
    marginTop: 10,
  },
});

export default RecipesModal;
