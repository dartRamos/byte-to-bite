import { View, Text, Image, Platform, Dimensions, StyleSheet } from 'react-native'
import React from 'react'
import { COLORS } from '@/constants/theme';
import { formatDistanceToNow } from 'date-fns';

interface Comment {
  content: string;
  _creationTime: number;
  user: {
    fullname: string;
    image: string;
  };
}

export default function Comment({comment}: {comment: Comment}) {

  return (
    <View style={styles.commentContainer}>
      <Image source={{uri: comment.user.image}} style={styles.commentAvatar}/>
      <View style={styles.commentContent}>
        <Text style={styles.commentUsername}>{comment.user.fullname}</Text>
        <Text style={styles.commentText}>{comment.content}</Text>
        <Text style={styles.commentTime}>
          {formatDistanceToNow(comment._creationTime, { addSuffix: true })}
        </Text>
      </View>
    </View>
  )
}

export const styles = StyleSheet.create({
  commentContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.surface,
  },
  commentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
  },
  commentContent: {
    flex: 1,
  },
  commentUsername: {
    color: "#ff7043",
    fontSize: 20,
    marginBottom: 4,
    fontFamily: "BoldPencil",
    textShadowColor: "rgba(0,0,0,0.2)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1
  },
  commentText: {
    color: "#ff7043",
    fontSize: 14,
    lineHeight: 20,
    fontFamily: "Pencil",
    textShadowColor: "rgba(0,0,0,0.2)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1
  },
  commentTime: {
    color: COLORS.grey,
    fontSize: 12,
    marginTop: 4,
  },
});