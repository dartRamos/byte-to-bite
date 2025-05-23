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

          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <TouchableOpacity onPress={onClose}>
                <Ionicons name="arrow-back" size={28} color="white" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Home</Text>
            </View>
  
            <View style={styles.headerRight}>
              <Text style={styles.headerTitle}>Find Recipe</Text>
              <TouchableOpacity onPress={getRecipeByIngredients}>
                <Ionicons name="search" size={28} color="white" />
              </TouchableOpacity>
            </View>
          </View>
  
          <ImageBackground
            source={require('../assets/images/notepad.png')}
            style={styles.backgroundImage}
          />

          <View style={styles.contentContainer}>
  
            <View style={styles.inputRow}>
              <TextInput
                style={[authStyles.input, {
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
                <Text style={{fontSize: 20, fontFamily: 'Pencil' }} >Undo</Text>
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
          isVisible={!showFullRecipeModal}
          recipes={recipes}
          onClose={() => setShowRecipeModal(false)}
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
  inputRow: {
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
    left: 30
  },
  editButtonRow: {
    width: '90%',
    alignItems: 'flex-start',
    marginBottom: 10,
    marginLeft: 30,
    left: 245,
    top: 245
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
});
