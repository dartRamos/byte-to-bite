import { COLORS } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Image } from "expo-image";

export default function MyPosts({ post }: { post: any }) {
  return (
    <View style={styles.post}>
      <View style={styles.postHeader}>
        <TouchableOpacity>
          <Ionicons name="trash-outline" size={20} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <Image
        source={post.imageUrl}
        style={styles.postImage}
        contentFit="cover"
        transition={200}
        cachePolicy="memory-disk"
      />

      <View style={styles.captionContainer}>
        {post.caption && <Text style={styles.captionText}>{post.caption}</Text>}
      </View>
    </View>
  );
}

const { width } = Dimensions.get("window");

export const styles = StyleSheet.create({
  post: {
    marginBottom: 16,
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
  },
  postImage: {
    width: width,
    height: width,
  },
  captionContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 6,
    paddingHorizontal: 12,
  },
  captionText: {
    fontSize: 14,
    color: COLORS.white,
    flex: 1,
  },
});
