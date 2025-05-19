import { useConvex } from "convex/react";
import React, { useEffect, useState, useRef } from 'react';
import { ImageBackground, Modal, SafeAreaView, Text, TextInput, TouchableOpacity, View, Image, ScrollView } from 'react-native';
import { api } from '../convex/_generated/api';
import { styles } from '../styles/auth.styles';

type RecipesModalProps = {
  isVisible: boolean;
  recipes: string[];
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
        {/* <ImageBackground source={require('../assets/images/paper.png')}
          style={{
            position: 'absolute',
            width: 400,
            height: 1300,
            borderRadius: 10,
            overflow: 'hidden',
          }}
        /> */}
        <ScrollView>
          {recipes.length > 0 && (
            <View>
              {recipes.slice(0, 5).map((recipe, index) => (
                <View 
                key={index}
                style={{
                 
                }}
                
                >
                  {/* <Text style={{color: "black", fontSize: 20, backgroundColor: 'white'}}>{recipe.title}</Text> */}
                  <Image 
                  source={{uri: recipe.image}}
                  style={{ width: 200, height: 100, marginTop: 10, borderRadius: 8,  }}
                  />
                </View>
              ))}
            </View>
          )}
        </ScrollView>

      </SafeAreaView>
    </Modal>
  )
}

export default RecipesModal