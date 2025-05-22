import React from 'react';
import {
  Modal,
  Text,
  TouchableOpacity,
  View,
  Image,
  SafeAreaView,
  ScrollView
} from 'react-native';

type SavedRecipe = {
  _id: string;
  recipeId: number;
  title: string;
  imageUrl: string;
  isFavorited: boolean;
};

type FullSavedRecipeModalProps = {
  isVisible: boolean;
  recipe: SavedRecipe | null;
  onClose: () => void;
};

const FullFavoriteRecipeModal = ({ isVisible, recipe, onClose }: FullSavedRecipeModalProps) => {
  if (!recipe) return null;

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20,
          }}
        >
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
              {recipe.imageUrl && (
                <Image
                  source={{ uri: recipe.imageUrl }}
                  style={{
                    width: '100%',
                    height: 200,
                    borderRadius: 10,
                    marginBottom: 10,
                  }}
                  resizeMode="cover"
                />
              )}

              <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
                {recipe.title}
              </Text>

              

              <Text style={{ marginBottom: 10 }}>
                Favorite: {recipe.isFavorited ? 'Yes' : 'No'}
              </Text>

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