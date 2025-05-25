import { useState, useEffect } from "react";
import { Pressable, ScrollView, View, Alert, Text, Image, StyleSheet } from "react-native";
import Fridge from "../../components/Fridge";
import IngredientInputModal from "../../components/IngredientInputModal";
import { styles } from '../../styles/auth.styles';

export default function Index() {
  const [showIngredientsModal, setShowIngredientsModal] = useState(false);


  // useEffect(() => {
  //   Alert.alert(
  //     "Let's get cookin'!",
  //     'Tap on the "Ingredients list" on the fridge!',
      
  //     [
  //       { 
  //         text: "Got it!",
  //       }
  //     ]
  //   );
  // }, []);

  return (
    <ScrollView>
      <View style={styles.container}>

        <Fridge />

        <Pressable
          onPress={() => setShowIngredientsModal(true)}
          style={{
            position: 'absolute',
            top: 150,
            left: 130,
            width: 150,
            height: 170,
            zIndex: 100,
          }}
        />

        <IngredientInputModal
          isVisible={showIngredientsModal}
          onClose={() => setShowIngredientsModal(false)}
        />

      </View>
    </ScrollView>
  );
}
