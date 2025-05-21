import { useConvex, useMutation } from "convex/react";
import React, { useState } from 'react';
import { ImageBackground, Modal, SafeAreaView, Text, TextInput, TouchableOpacity, View} from 'react-native';
import { api } from '../convex/_generated/api';
import { styles } from '../styles/auth.styles';
import RecipesModal from "./RecipesModal";
import FullRecipeModal from "./FullRecipeModal";

// Define the Recipe type
type Recipe = {
  title: string;
  image: string;
  id: number;
};

//  Define the Full Recipe type
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

  // add state for full recipe modal 
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

    // Save each new ingredient to DB 
    for (const ingredient of newIngredients) {
      try {
        await insertIngredient({
          ingredientName: ingredient,
          isPantryStaple: false // or true if you want to allow that input later
        });
      } catch (err) {
        console.error("Failed to insert ingredient:", ingredient, err);
      }
    }
  };

  // Fetches recipes via API
  const getRecipeByIngredients = async () => {
    if (ingredients.length === 0) return;

    try {
      const data = await convex.action(api.functions.fetchRecipeByIngredients.fetchRecipes, { items: ingredients });
      //console.log("Fetched recipes:", data);

      // Ensure response matches Recipe type
      const formattedRecipes: Recipe[] = data.map((item: any) => ({
        title: item.title,
        image: item.image,
        id: item.id // will need the id for full recipe API call
      }));

      // console.log("Formatted recipes", formattedRecipes);

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
   
    //console.log("FULL RECIPE DATA", fullRecipe);  // Check if the data comes through

    setSelectedRecipe(fullRecipe);
    setShowFullRecipeModal(true);

  } catch (error) {
    console.error("Error fetching full recipe:", error);
  }
};

  // Edits ingredient list
  const handleEditList = () => {
    if (ingredients.length > 0) {
      setIngredients([]);
    }
  }

  return (
    <>
      <Modal
        animationType='slide'
        transparent={true}
        visible={isVisible && !showRecipeModal}
        onRequestClose={onClose}
      >
        <SafeAreaView style={{
          position: 'relative',
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0,0,0,0.5)'
        }}>
          <ImageBackground source={require('../assets/images/notepad.png')}
            style={{
              position: 'absolute',
              width: 1000,
              height: 2000,
              top: -205,
              borderRadius: 10,
              overflow: 'hidden',
            }}
          />
          <View style={{
            position: 'absolute',
            top: 150,
            left: '10%',
            right: '10%',
            flexDirection: 'row',
            flexWrap: 'wrap',
            padding: 10,
            borderRadius: 8,
            gap: 7,
            zIndex: 10,
          }}>
            {ingredients.map((item, index) => (
              <Text key={index} style={{ fontSize: 20 }}>
                • {item}
              </Text>
            ))}
          </View>

          {ingredients.length === 0 ? (
            <View style={{ top: 170, flexDirection: 'row', alignItems: 'center' }}>
              <TextInput
                style={styles.input}
                onChangeText={(value) => setText(value)}
                value={text}
                placeholder="Enter All Ingredients"
                onSubmitEditing={handleAddIngredient}
              />
              <TouchableOpacity
                style={styles.findRecipeButton}
                onPress={handleAddIngredient}
              >
                <Text>Add Ingredients</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={{ top: 170, flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity
                style={styles.findRecipeButton}
                onPress={getRecipeByIngredients}
              >
                <Text>Find Recipe!</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.findRecipeButton}
                onPress={handleEditList}
              >
                <Text>Edit List</Text>
              </TouchableOpacity>
            </View>
          )}
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
