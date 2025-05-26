import React from 'react';
import FavoriteButton from './FavoriteButton';
import {
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Image,
  SafeAreaView,
  StyleSheet,
} from 'react-native';

type FullRecipe = {
  id: number;
  title: string;
  readyInMinutes: number;
  servings: number;
  instructions: string;
  image: string;
  extendedIngredients: { id: number; name: string; amount: number; unit: string }[];
};

type FullRecipeModalProps = {
  isVisible: boolean;
  recipe: FullRecipe | null;
  onClose: () => void;
};

// helper to remove <ol>, <ul> tags coming from API
const extractSteps = (html: string): string[] => {
  return html
    .replace(/<\/?ol>|<\/?ul>/g, '') 
    .split(/<\/li>\s*/i)  
    .map(item => item.replace(/<li>/i, '').trim()) 
    .filter(step => step.length > 0); 
};

const FullRecipeModal = ({ isVisible, recipe, onClose }: FullRecipeModalProps) => {
  if (!recipe) return null;

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <View style={styles.modalContent}>

            <TouchableOpacity onPress={onClose} style={styles.closeIcon}>
              <Text style={styles.closeIconText}>×</Text>
            </TouchableOpacity>

            <ScrollView>
              {recipe.image && (
                <Image
                  source={{ uri: recipe.image }}
                  style={styles.image}
                  resizeMode="cover"
                />
              )}

              <Text style={styles.title}>
                {recipe.title}
              </Text>
              
              <View style={styles.favoriteRow}>
                <FavoriteButton 
                  recipeId={recipe.id} 
                  title={recipe.title} 
                  imageUrl={recipe.image} />
                <Text style={styles.saveText}>
                   Save this recipe
                </Text>
              </View>
              
              <Text style={styles.bodyText}>Ready in: {recipe.readyInMinutes} minutes</Text>
              <Text style={styles.bodyText}>Servings: {recipe.servings}</Text>

              <Text style={styles.sectionHeader}>Ingredients:</Text>
              {recipe.extendedIngredients.map((ingredient, index) => (
                <Text key={`${ingredient.id}-${index}`} style={styles.ingredientText}>
                  • {ingredient.amount} {ingredient.unit} {ingredient.name}
                </Text>
              ))}

              <Text style={styles.sectionHeader}>Instructions:</Text>
              {extractSteps(recipe.instructions).map((step, index) => (
                <Text key={index} style={styles.bodyText}>{step}</Text>
              ))}
            </ScrollView>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxHeight: '85%',
    backgroundColor: '#fffde7', 
    borderRadius: 24,
    padding: 24,
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
    marginBottom: 16,
    marginTop: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#ff7043', 
    marginBottom: 10,
  },
  favoriteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  saveText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#757575', // medium gray
  },
  sectionHeader: {
    marginTop: 20,
    marginBottom: 6,
    fontWeight: '700',
    fontSize: 18,
    color: '#ff7043', // coral accent for headings
    borderBottomWidth: 1,
    borderBottomColor: '#fbc02d',
    paddingBottom: 4,
  },
  ingredientText: {
    fontSize: 15,
    color: '#333',
    marginBottom: 4,
  },
  bodyText: {
    fontSize: 15,
    color: '#333',
    marginBottom: 8,
    lineHeight: 22,
  },
  closeIcon: {
    position: 'absolute',
    top: 15,
    right: 15,
    zIndex: 10,
    backgroundColor: '#fbc02d', // solid golden yellow
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 3,
  },
  closeIconText: {
    fontSize: 28,
    color: '#212121', // dark text
    fontWeight: 'bold',
    lineHeight: 28,
  },
});

export default FullRecipeModal;
