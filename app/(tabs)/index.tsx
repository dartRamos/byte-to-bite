import { useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import Fridge from "../../components/Fridge";
import IngredientInputModal from "../../components/IngredientInputModal";
import { styles } from '../../styles/auth.styles';

export default function Index() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <ScrollView>
    <View style={styles.container}>
      <Fridge />

      {/* Show Modal Button on top of image */}
      <Pressable
        onPress={() => setModalOpen(true)}
        style={styles.modalOpen}
        >
      </Pressable>

      <IngredientInputModal
        isVisible={modalOpen}
        onClose={() => setModalOpen(false)}
      />

    </View>
  </ScrollView>
  );
}