import React from 'react';
import { Modal, Text, TouchableOpacity, View, Image, SafeAreaView, ScrollView } from 'react-native';

type FullRecipe = {
  id: number;
  title: string;
  readyInMinutes: number;
  servings: number;
  instructions: string;
  image: string;
  extendedIngredients: { id: number; name: string; amount: number; unit: string }[];
};

type FullFavoriteRecipeModalProps = {
  isVisible: boolean;
  recipe: FullRecipe | null;
  onClose: () => void;
};

const FullFavoriteRecipeModal = ({ isVisible, recipe, onClose }: FullFavoriteRecipeModalProps) => {
  if (!recipe) return null;

  return (
    <Modal visible={isVisible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <SafeAreaView style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <View
            style={{
              width: '100%',
              maxHeight: '80%',
              backgroundColor: 'white',
              borderRadius: 10,
              padding: 15,
            }}
          >
            <ScrollView>
              {recipe.image && (
                <Image
                  source={{ uri: recipe.image }}
                  style={{ width: '100%', height: 200, borderRadius: 10, marginBottom: 10 }}
                  resizeMode="cover"
                />
              )}

              <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>{recipe.title}</Text>

              <Text>Ready in: {recipe.readyInMinutes} minutes</Text>
              <Text>Servings: {recipe.servings}</Text>

              <Text style={{ marginVertical: 10, fontWeight: 'bold' }}>Ingredients:</Text>
              {recipe.extendedIngredients.map((ingredient) => (
                <Text key={ingredient.id}>
                  - {ingredient.amount} {ingredient.unit} {ingredient.name}
                </Text>
              ))}

              <Text style={{ marginVertical: 10, fontWeight: 'bold' }}>Instructions:</Text>
              <Text>{recipe.instructions}</Text>

              <TouchableOpacity
                onPress={onClose}
                style={{
                  marginTop: 20,
                  padding: 10,
                  backgroundColor: '#2196F3',
                  borderRadius: 5,
                  alignItems: 'center',
                }}
              >
                <Text style={{ color: 'white', fontWeight: 'bold' }}>Close</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default FullFavoriteRecipeModal;
