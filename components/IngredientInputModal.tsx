import { useConvex } from "convex/react";
import React, { useState } from 'react';
import { ImageBackground, Modal, SafeAreaView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { api } from '../convex/_generated/api';
import { styles } from '../styles/auth.styles';
import RecipesModal from "./RecipesModal";

// ✅ Define the Recipe type
type Recipe = {
  title: string;
  image: string;
  id: string;
};

type IngredientInputModalProps = {
  isVisible: boolean;
  onClose: () => void;
};

export default function IngredientInputModal({ isVisible, onClose }: IngredientInputModalProps) {
  const convex = useConvex();

  const [text, setText] = useState('');
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]); // ✅ Corrected type
  const [showRecipeModal, setShowRecipeModal] = useState(false);

  const handleAddIngredient = () => {
    if (!text.trim()) return;

    const newIngredients = text
      .trim()
      .split(/\s+/)
      .filter(item => item.length > 0);

    setIngredients(prev => [...prev, ...newIngredients]);
    setText('');
  };

  const getRecipeByIngredients = async () => {
    if (ingredients.length === 0) return;

    try {
      const data = await convex.action(api.functions.fetchRecipeByIngredients.fetchRecipes, { items: ingredients });
      //console.log("Fetched recipes:", data);

      // ✅ Ensure response matches Recipe type
      const formattedRecipes: Recipe[] = data.map((item: any) => ({
        title: item.title,
        image: item.image,
        id: item.id // will need the id for full recipe API call
      }));

      console.log("Formatted recipes", formattedRecipes);

      setRecipes(formattedRecipes);
      onClose();
      setShowRecipeModal(true);
    } catch (err) {
      console.error('This is an error', err);
      setRecipes([]);
    }
  };

  return (
    <>
      <Modal
        animationType='slide'
        transparent={true}
        visible={isVisible}
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
            </View>
          )}
        </SafeAreaView>
      </Modal>

      {showRecipeModal && (
        <RecipesModal
          isVisible={showRecipeModal}
          recipes={recipes}
          onClose={() => setShowRecipeModal(false)}
          onSelectRecipe={(id) => {
            console.log("Selected recipe ID:", id);
          }}
        />
      )}
    </>
  );
}
