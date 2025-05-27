import { COLORS } from '@/constants/theme';
import { useUser } from "@clerk/clerk-expo";
import { Ionicons } from '@expo/vector-icons';
import { useMutation } from 'convex/react';
import * as FileSystem from "expo-file-system";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useState } from 'react';
import { ActivityIndicator, Dimensions, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { api } from '../../convex/_generated/api';


export default function CreateScreen() {
  const router = useRouter();
  const { user } = useUser();

  const [caption, setCaption] = useState("");
  const [selectImage, setSelectImage] = useState<string | null>(null);
  const [isSharing, setIsSharing] = useState(false);
  const [title, setTitle] = useState("");
  const [isRecipe, setIsRecipe] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) setSelectImage(result.assets[0].uri);
  };

  const generateUploadUrl = useMutation(api.functions.posts.generateUploadUrl);
  const createPost = useMutation(api.functions.posts.createPost);

  const handleShare = async () => {
    if (!selectImage) return;

    try {
      setIsSharing(true);
      const uploadUrl = await generateUploadUrl();

      const uploadResult = await FileSystem.uploadAsync(uploadUrl,
        selectImage, {
          httpMethod: "POST",
          uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT,
          mimeType: "image/jpeg",
        });

      if (uploadResult.status !== 200) throw new Error("Upload Failed");

      const { storageId } = JSON.parse(uploadResult.body);
      await createPost({ storageId, caption, title, isRecipe });

      // Reset local state before navigation
      setSelectImage(null);
      setCaption("");
      setTitle("");
      setIsRecipe(false);

      router.push("/(tabs)/feed");

    } catch (err) {
      console.log("Error uploading post", err);
    } finally {
      setIsSharing(false);
    }
  };

  if (!selectImage) {
    return (
      <View style={styless.container}>
        <View style={styless.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={28} color={"#e0b300"} />
          </TouchableOpacity>
          <Text style={styless.headerTitle}>New Post</Text>
          <View style={{ width: 28 }} />
        </View>

        <TouchableOpacity onPress={pickImage} style={styless.emptyImageContainer}>
          <Ionicons name="image-outline" size={48} color={"#e0b300"} />
          <Text style={styless.headerTitle}>Tap to select an image.</Text>
        </TouchableOpacity>
        <View style={{ width: 28 }} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styless.container}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 40}
    >
      <View style={styless.contentContainer}>
        <View style={styless.header}>
          <TouchableOpacity
            onPress={() => {
              setSelectImage(null);
              setCaption("");
              setTitle("");
            }}
            disabled={isSharing}
          >
            <Ionicons
              name="close-outline"
              size={28}
              color={isSharing ? COLORS.grey : "#e0b300"}
            />
          </TouchableOpacity>
          <Text style={styless.headerTitle}>New Post</Text>
          <TouchableOpacity
            style={styless.shareButton}
            disabled={isSharing || !selectImage}
            onPress={handleShare}
          >
            {isSharing ? (
              <ActivityIndicator size="small" color={COLORS.primary} />
            ) : (
              <Text style={styless.shareText}>Share</Text>
            )}
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={styless.scrollContent}
          bounces={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styless.content}>
            {/* Image Section */}
            <View style={styless.imageSection}>
              <Image
                source={selectImage}
                style={styless.previewImage}
                contentFit="cover"
                transition={200}
              />
              <TouchableOpacity
                style={styless.changeImageButton}
                onPress={pickImage}
                disabled={isSharing}
              >
                <Ionicons name="image-outline" size={20} color={COLORS.white} />
                <Text style={styless.changeImageText}>Change</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styless.recipeToggle}
              onPress={() => setIsRecipe(!isRecipe)}
              disabled={isSharing}
              activeOpacity={0.8}
            >
              <View
                style={[
                  styless.checkbox,
                  isRecipe ? styless.checkboxChecked : styless.checkboxUnchecked,
                ]}
              >
                {isRecipe && <Ionicons name="checkmark" size={18} color="#fff" />}
              </View>
              <Text style={styless.checkboxLabel}>Recipe Post</Text>
            </TouchableOpacity>

            <View style={styless.inputSection}>
              <TextInput
                style={styless.titleInput}
                placeholder="Post Title"
                placeholderTextColor={"#ff7043"}
                value={title}
                onChangeText={setTitle}
                editable={!isSharing}
              />

              <View style={styless.captionContainer}>
                <Image
                  source={user?.imageUrl}
                  style={styless.userAvatar}
                  contentFit="cover"
                  transition={200}
                />
                <TextInput
                  style={styless.captionInput}
                  placeholder="Write a caption"
                  placeholderTextColor={"#ff7043"}
                  multiline
                  value={caption}
                  onChangeText={setCaption}
                  editable={!isSharing}
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const { width } = Dimensions.get("window");

const styless = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fffde7",
  },
  contentContainer: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    backgroundColor: "rgba(107, 76, 29, 1)",
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: "600",
    color: "#e0b300",
    fontFamily: "BoldPencil",
  },
  shareButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    minWidth: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  shareText: {
    color: "#e0b300",
    fontSize: 21,
    fontWeight: "600",
    fontFamily: "BoldPencil",
  },
  emptyImageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  imageSection: {
    width: width,
    height: width,
    backgroundColor: COLORS.surface,
    justifyContent: "center",
    alignItems: "center",
  },
  previewImage: {
    width: "100%",
    height: "100%",
  },
  changeImageButton: {
    position: "absolute",
    bottom: 16,
    right: 16,
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderRadius: 8,
    gap: 6,
  },
  changeImageText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "500",
  },
  inputSection: {
    padding: 16,
    flex: 1,
  },
  titleInput: {
    color: "#ff7043",
    fontSize: 20,
    fontWeight: "600",
    backgroundColor: "#FFF8C4",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 16,
    fontFamily: "Pencil",
  },
  captionContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  userAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
  },
  captionInput: {
    flex: 1,
    color: "#ff7043",
    fontSize: 16,
    paddingTop: 8,
    minHeight: 40,
    fontFamily: "Pencil",
  },
  recipeToggle: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#ff7043",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  checkboxChecked: {
    backgroundColor: "#ff7043",
    borderColor: "#ff7043",
  },
  checkboxUnchecked: {
    backgroundColor: "#FFF8C4",
    borderColor: "#ff7043",
  },
  checkboxLabel: {
    color: "#ff7043",
    fontSize: 18,
    fontFamily: "Pencil",
  },
});
