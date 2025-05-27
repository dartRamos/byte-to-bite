import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

type UserRecipeModal = {
  visible: boolean;
  onClose: () => void;
  post: any;
};

export default function UserRecipeModal({ visible, onClose, post }: UserRecipeModal) {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>{post.title}</Text>
          <Text style={styles.caption}>{post.caption}</Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.close}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 12,
    width: '80%',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'BoldPencil',
    fontSize: 22,
    marginBottom: 10,
    color: '#ff3d00',
  },
  caption: {
    fontFamily: 'Pencil',
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
  },
  close: {
    fontFamily: 'Pencil',
    fontSize: 16,
    color: '#ff7043',
  },
});