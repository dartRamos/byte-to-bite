import React from 'react';
import { Image, Modal, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { styles } from '../styles/auth.styles';

type Recipe = {
  image: string;
  title: string;
};

type RecipesModalProps = {
  isVisible: boolean;
  recipes: Recipe[];
  onClose: () => void;
  onBack?: () => void; // Make onBack optional
};

const RecipesModal = ({ isVisible, recipes, onClose, onBack }: RecipesModalProps) => {

  return (
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
        <TouchableOpacity
          style={styles.findRecipeButton}
          onPress={onBack}
        >
          <Text>Return to previous modal</Text>
        </TouchableOpacity>
        <ScrollView>
          {recipes.length > 0 && (
            <View>
              {recipes.slice(0, 5).map((recipe, index) => (
                <View key={index} style={{ position: 'relative' }}>
                  <Image
                    source={{ uri: recipe.image }}
                    style={{ width: 400, height: 300, marginTop: 10, borderRadius: 8 }}
                  />
                  <Text style={{
                    color: "white",
                    fontSize: 25,
                    bottom: 0,
                    position: 'absolute',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    flexWrap: 'wrap'
                  }}>
                    {recipe.title}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

export default RecipesModal;
