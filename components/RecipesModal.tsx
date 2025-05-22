import React from 'react';
import { Image, Modal, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Recipe = {
  image: string;
  title: string;
  id: number;
};

type RecipesModalProps = {
  isVisible: boolean;
  recipes: Recipe[];
  onClose: () => void;
  onBack?: () => void; // optional
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

        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeText}>X</Text>
        </TouchableOpacity>

        <ScrollView>
           
          {recipes.length > 0 && (
            <View>
              {recipes.slice(0, 5).map((recipe, index) => (
                <View key={index} style={{ position: 'relative' }}>
                  <Image
                    source={{ uri: recipe.image }}
                    style={styles.recipeImage}
                  />
                  <Text style={{
                    color: "white",
                    fontSize: 25,
                    bottom: 0,
                   
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    flexWrap: 'wrap'
                  }}>
                    {recipe.title}
                  </Text>

                  <TouchableOpacity
                    style={styles.viewButton}
                    onPress={() => onSelectRecipe(recipe.id)}
                  >
                    <Text style={styles.viewButtonText}>View Full Recipe</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    position: 'relative',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  closeButton: {
    position: 'absolute',
    top: 100,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: 20,
    zIndex: 20,
  },
  closeText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  recipeImage: {
    width: 400,
    height: 300,
    marginTop: 10,
    borderRadius: 8,
  },
  viewButton: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 6,
    alignSelf: 'center',
    marginTop: 10,
  },
  viewButtonText: {
    color: '#333',
    fontWeight: 'bold',
  },
});

export default RecipesModal;
