import { useConvex, useMutation } from "convex/react";
import React, { useState } from 'react';
import { ImageBackground, Modal, SafeAreaView, Text, TextInput, TouchableOpacity, View, StyleSheet } from 'react-native';
import { api } from '../convex/_generated/api';
import { styles as authStyles } from '../styles/auth.styles';
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

          {/* Close Button */}
          <View style={styles.header}>
            {/* Left Side */}
            <View style={styles.headerLeft}>
              <TouchableOpacity onPress={onClose}>
                <Ionicons name="arrow-back" size={28} color="white" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Home</Text>
            </View>

            {/* Right Side */}
            <View style={styles.headerRight}>
              <Text style={styles.headerTitle}>Find Recipe</Text>
              <TouchableOpacity onPress={getRecipeByIngredients}>
                <Ionicons name="search" size={28} color="white" />
              </TouchableOpacity>
            </View>
        </View>

          <ImageBackground source={require('../assets/images/notepad.png')}
            style={styles.backgroundImage}
          />

          <View style={styles.contentContainer}>

            {/* Input Row fixed at top */}
            <View style={styles.inputRow}>
            <TextInput
              style={[authStyles.input, {
                width: 163, // or '70%', or whatever fixed width you want
                height: 40,
                paddingVertical: 8,
                overflow: 'hidden',
                flexShrink: 0, // prevents shrinking in flex layouts
              }]}
              onChangeText={setText}
              value={text}
              placeholder="Enter All Ingredients"
              onSubmitEditing={handleAddIngredient}
              multiline={false}
            />
              <TouchableOpacity
                style={authStyles.findRecipeButton}
                onPress={handleAddIngredient}
              >
                <Text>Add Ingredients</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.editButtonRow}>
              <TouchableOpacity
                style={authStyles.findRecipeButton}
                onPress={handleEditList}
              >
                <Text>Undo Last</Text>
              </TouchableOpacity>
            </View>

            {/* Ingredients list below input */}
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
          isVisible={!showFullRecipeModal}
          recipes={recipes}
          onClose={() => setShowRecipeModal(false)}
          onSelectRecipe={handleSelectRecipe}
          onBack={() => setShowRecipeModal(false)}
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
    backgroundColor: 'rgba(0,0,0,0.5)',
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
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  backgroundImage: {
    position: 'absolute',
    width: 1000,
    height: 2000,
    top: 0,
    borderRadius: 10,
    overflow: 'hidden',
  },
  contentContainer: {
    flex: 1,
    width: '100%',
    paddingTop: 20, // space below header
    alignItems: 'center',
  },
  inputRow: {
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20, // space below inputs
    left: 30
  },
  editButtonRow: {
    width: '90%',
    alignItems: 'flex-start',
    marginBottom: 10,
    marginLeft: 30,
    left: 200
  },
  ingredientListContainer: {
    width: '90%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'flex-start',
    top: 140,
    left: 20
  },
  ingredientText: {
    fontSize: 25,
    marginRight: 8,
    marginBottom: 8,
    fontFamily: 'Pencil',
  },
});
