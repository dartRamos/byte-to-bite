import { useState, useEffect } from "react";
import { Pressable, ScrollView, View, Alert, Text } from "react-native";
import Fridge from "../../components/Fridge";
import IngredientInputModal from "../../components/IngredientInputModal";
import { styles } from '../../styles/auth.styles';

export default function Index() {
  const [showIngredientsModal, setShowIngredientsModal] = useState(false);


  useEffect(() => {
    Alert.alert(
      "Let's get cookin'!",
      '1. Tap on the "Ingredients" list on the fridge.\n\n2. Enter all Ingredients you want to use and hit enter or tap the "Add ingredients" button.\n\n3. Tap "Find Recipes" and get to cooking!',
      
      [
        { 
          text: "Got it!",
        }
      ]
    );
  }, []);

  return (
    <ScrollView>
    <View style={styles.container}>

      <Fridge />

      {/* Show Modal Button on top of image */}
      <Pressable
        onPress={() => setShowIngredientsModal(true)}
        style={styles.modalOpen}
        >
      </Pressable>

      <IngredientInputModal
          isVisible={showIngredientsModal}
          onClose={() => setShowIngredientsModal(false)}
        />

    </View>
  </ScrollView>
  );
}