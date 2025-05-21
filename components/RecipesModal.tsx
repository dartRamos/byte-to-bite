import React from 'react';
import { Image, Modal, SafeAreaView, ScrollView, Text, View } from 'react-native';

type Recipe = {
  image: string;
  title: string;
};

type RecipesModalProps = {
  isVisible: boolean;
  recipes: Recipe[];
  onClose: () => void;
};

const RecipesModal = ({ isVisible, recipes, onClose }: RecipesModalProps) => {
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
