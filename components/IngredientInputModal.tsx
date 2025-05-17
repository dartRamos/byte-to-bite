// IngredientInputModal.js
import React, { useEffect, useState } from 'react';
import { Alert, ImageBackground, Modal, SafeAreaView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { styles } from '../styles/auth.styles';
import { useConvex } from "convex/react";
import { api } from '../convex/_generated/api';

export default function IngredientInputModal({ isVisible, onClose }) {
  
  const convex = useConvex();

  const [text, setText] = useState('');
  const [ingredients, setIngredients] = useState([]);
  const [recipes, setRecipes] = useState([]);

  const handleAddIngredient = () => {
    if (!text.trim()) return;
    setIngredients(prev => [...prev, text.trim()]);
    setText('');
  };

  const getRecipeByIngredients = async () => {
    if (ingredients.length === 0) {
      Alert.alert("Please add at least one ingredient");
      return;
    }
  
    try {
      const data = await convex.action(api.functions.fetch.fetchRecipes, { items: ingredients });
      console.log("Fetched recipes:", data);
      setRecipes(data);
    } catch (err) {
      console.error(err);
      setRecipes([]);
    }
  };


  useEffect(() => {
    getRecipeByIngredients();
  }, []);

  return (
    <Modal
      animationType='slide'
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <SafeAreaView style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)' // dim background
      }}>
        <ImageBackground source={require('../assets/images/list.png')}
           style={{
            position: 'absolute',
            width: 1000,
            height: 1900,
            padding: 20,
            top: -85,
            borderRadius: 10,

            overflow: 'hidden', // to keep rounded corners on image
          }}
        />
        <View style={{
          top: 170,
        }}> 
          <TextInput
            style={styles.input}
            onChangeText={(value) => setText(value)}
            value={text}
            placeholder="Enter Ingredient"
            onSubmitEditing={handleAddIngredient}
            />
            <TouchableOpacity 
              style={styles.findRecipeButton}
              onPress={getRecipeByIngredients}
            >
              <Text>Find Recipe!</Text>
            </TouchableOpacity>
            </View>
          
          <View style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            padding: 10,
            top: -100,
            borderRadius: 8,
            maxWidth: '79%',
            gap: 7,
          }}>
            {ingredients.map((item, index) => (
              <Text key={index} style={{ 
                fontSize: 20,
              }}>
                • {item}
              </Text>
            ))}
          </View>

        
      </SafeAreaView>
    </Modal>
  );
}