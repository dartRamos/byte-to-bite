import { COLORS } from '@/constants/theme';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { Ionicons } from '@expo/vector-icons';
import { useMutation, useQuery } from 'convex/react';
import React, { useState } from 'react';
import { Dimensions, FlatList, KeyboardAvoidingView, Modal, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Comment from './Comment';
import { Loader } from './Loader';

type CommentsModal = {
    postId: Id<"posts">;
    visible: boolean;
    onClose: () => void;
    onCommentAdded: () => void;
}

export default function CommentsModal({onClose, onCommentAdded, visible, postId}: CommentsModal) {

  const [newComment, setNewComment] = useState('');
  const comments = useQuery(api.functions.comments.getComments, { postId });
  const addComment = useMutation(api.functions.comments.addComment);
  
  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try{
      await addComment({
        content: newComment,
        postId
      })

      setNewComment("");
      onCommentAdded();
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };


  return (
    <Modal visible={visible} animationType='slide' transparent={true} onRequestClose={onClose}>


      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalContainer}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 45} 
      >
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color={"#e0b300"} />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Comments</Text>
          <View style={{width: 24}} />
        </View>

        {comments === undefined ? (
          <Loader />
        ) : (
          <FlatList
            data={comments}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => <Comment comment={item} />}
            contentContainerStyle={styles.commentsList}
          />
        )}

        <View style={styles.commentInput}>
          <TextInput 
            style={styles.input}
            placeholder="Add a comment..."
            placeholderTextColor={COLORS.grey}
            value={newComment}
            onChangeText={setNewComment}
            multiline
          />

          <TouchableOpacity onPress={handleAddComment} disabled={!newComment.trim()}>
            <Text style={styles.postButton}>
              Post
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  )
}

export const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: "#fffde7",
    marginBottom: Platform.OS === "ios" ? 44 : 0,
    flex: 1,
    marginTop: Platform.OS === "ios" ? 44 : 0,
  },
  modalHeader: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  paddingHorizontal: 16,
  height: 56,
  borderBottomWidth: 0.5,
  backgroundColor: "rgba(107, 76, 29, 1)", // added line
},
  modalTitle: {
    color: "#e0b300",
    fontSize: 35,
    fontFamily: "BoldPencil",
  },
  commentsList: {
    flex: 1,
  },
  commentInput: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 0.5,
    borderTopColor: COLORS.surface,
    backgroundColor: "rgba(107, 76, 29, 1)",
  },
  input: {
    flex: 1,
    color: "#ff7043",
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 12,
    backgroundColor: "#fffde7",
    borderRadius: 20,
    fontSize: 14,
    fontFamily: "Pencil",
  },
  postButton: {
    color: "#e0b300",
    fontWeight: "600",
    fontSize: 25,
    fontFamily: "BoldPencil",
  },
});