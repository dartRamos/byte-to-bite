import { useConvex, useMutation } from "convex/react";
import React, { useState } from 'react';
import { ImageBackground, Modal, SafeAreaView, Text, TextInput, TouchableOpacity, View, StyleSheet } from 'react-native';
import { api } from '../convex/_generated/api';
import RecipesModal from "./RecipesModal";
import FullRecipeModal from "./FullRecipeModal";
import { Ionicons } from "@expo/vector-icons";

type Recipe = {
  title: string;
  image: string;
  id: number;
};

type FullRecipe = {
  id: number;
  title: string;
  readyInMinutes: number;
  servings: number;
  instructions: string;
  image: string;
  extendedIngredients: { id: number; name: string; amount: number; unit: string }[];
};

type IngredientInputModalProps = {
  isVisible: boolean;
  onClose: () => void;
};

export default function IngredientInputModal({ isVisible, onClose }: IngredientInputModalProps) {
  
  const convex = useConvex();
  const insertIngredient = useMutation(api.functions.userIngredients.insertUserIngredient);

  const [text, setText] = useState('');
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]); 
  const [showRecipeModal, setShowRecipeModal] = useState(false);

  const [selectedRecipe, setSelectedRecipe] = useState<FullRecipe | null>(null);
  const [showFullRecipeModal, setShowFullRecipeModal] = useState(false);

  const handleAddIngredient = async () => {
    if (!text.trim()) return;

    const newIngredients = text
      .trim()
      .split(/\s+/)
      .map(item => item.toLowerCase())
      .filter(item => item.length > 0);

    setIngredients(prev => [...prev, ...newIngredients]);
    setText('');

    for (const ingredient of newIngredients) {
      try {
        await insertIngredient({
          ingredientName: ingredient,
          isPantryStaple: false
        });
      } catch (err) {
        console.error("Failed to insert ingredient:", ingredient, err);
      }
    }
  };

  const getRecipeByIngredients = async () => {
    if (ingredients.length === 0) return;

    try {
      const data = await convex.action(api.functions.fetchRecipeByIngredients.fetchRecipes, { items: ingredients });

      const formattedRecipes: Recipe[] = data.map((item: any) => ({
        title: item.title,
        image: item.image,
        id: item.id
      }));

      setRecipes(formattedRecipes);
      setShowRecipeModal(true);
    } catch (err) {
      console.error('This is an error', err);
      setRecipes([]);
    }
  };

  const handleSelectRecipe = async (id: number) => {
    try {
      const fullRecipe = await convex.action(api.functions.fetchRecipeByRecipeId.fetchRecipeById, { id });

      setSelectedRecipe(fullRecipe);
      setShowFullRecipeModal(true);

    } catch (error) {
      console.error("Error fetching full recipe:", error);
    }
  };

  const handleEditList = () => {
    setIngredients(prev => prev.slice(0, -1));
  };

  return (
    <>
      <Modal
        animationType='slide'
        transparent={true}
        visible={isVisible && !showRecipeModal}
        onRequestClose={onClose}
      >
        <SafeAreaView style={styles.safeArea}>

          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <TouchableOpacity onPress={onClose}>
                <Ionicons name="arrow-back" size={28} color="#e0b300" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Home</Text>
            </View>
            
          </View>
  
          <ImageBackground
            source={require('../assets/images/notepad.png')}
            style={styles.backgroundImage}
          />

          <View style={styles.contentContainer}>
  
            <View style={styles.inputRow}>
              <TextInput
                style={[styles.input, {
                  width: 303,
                  height: 100,
                  paddingVertical: 8,
                  color: '#000',
                  backgroundColor: 'transparent',
                  borderWidth: 0,
                  borderRadius: 0,
                  overflow: 'hidden',
                  flexShrink: 0,
                  fontFamily: 'Pencil',
                  fontSize: 20,
                  textAlignVertical: 'top'
                }]}
                onChangeText={setText}
                value={text}
                placeholder="Enter All Ingredients"
                placeholderTextColor="grey"
                onSubmitEditing={handleAddIngredient}
                multiline={false}
              />
            </View>
  
            <View style={styles.editButtonRow}>
              <TouchableOpacity
                style={styles.findRecipeButton}
                onPress={handleEditList}
              >
                <Text style={styles.buttonText}>Undo</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.findRecipeButton}
                onPress={getRecipeByIngredients}
              >
                <Text style={styles.buttonText}>Find Recipe
                  <Ionicons name="search" size={28} color="black" />
                </Text>
                
              </TouchableOpacity>
            </View>
  
            <View style={styles.ingredientListContainer}>
              {ingredients.map((item, index) => (
                <Text key={index} style={styles.ingredientText}>
                  • {item}
                </Text>
              ))}
            </View>
  
          </View>
        </SafeAreaView>
      </Modal>
  
      {showRecipeModal && (
        <RecipesModal
        isVisible={showRecipeModal && !showFullRecipeModal}
        recipes={recipes}
        onClose={() => {
          setShowRecipeModal(false);
          setShowFullRecipeModal(false); // Optional: for safety
        }}
        onSelectRecipe={handleSelectRecipe}
      />
      )}
  
      <FullRecipeModal
        isVisible={showFullRecipeModal}
        recipe={selectedRecipe}
        onClose={() => {
          setSelectedRecipe(null);
          setShowFullRecipeModal(false);
        }}
      />
    </>
  );
  
}

const styles = StyleSheet.create({
  safeArea: {
    position: 'relative',
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 253, 231, 0.1)',
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(107, 76, 29, 1)',
    zIndex: 10,
  },
  
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerTitle: {
    color: '#e0b300',
    fontSize: 35,
    fontFamily: 'BoldPencil',
    marginLeft: 12,
  },
  backgroundImage: {
    position: 'absolute',
    width: 1000,
    height: 2000,
    top: -100,
    borderRadius: 10,
    overflow: 'hidden',
  },
  contentContainer: {
    flex: 1,
    width: '100%',
    paddingTop: 20,
    alignItems: 'center',
  },
  input: {
    borderWidth: 1,
    backgroundColor: 'white',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 5,
    marginRight: 10,
    top: 165
  },
  inputRow: {
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 40,
    left: 30
  },

  editButtonRow: {
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
    top: 250,
    paddingHorizontal: 20,
    

  },
  findRecipeButton: {
    borderWidth: 1,
    backgroundColor: "transparent",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    
  },
  ingredientListContainer: {
    width: '90%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'flex-start',
    top: 10,
    left: 20
  },
  ingredientText: {
    fontSize: 25,
    marginRight: 8,
    marginBottom: 8,
    fontFamily: 'Pencil',
  },

  buttonText: {
  fontSize: 20,
  fontFamily: 'Pencil',
},
});
