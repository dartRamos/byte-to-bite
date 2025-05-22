import { COLORS } from '@/constants/theme';
import { useUser } from "@clerk/clerk-expo";
import { Ionicons } from '@expo/vector-icons';
import { useMutation } from 'convex/react';
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useState } from 'react';
import * as FileSystem from "expo-file-system"
import { ActivityIndicator, Dimensions, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { api } from '../../convex/_generated/api';

export default function CreateScreen() {
  const router = useRouter();
  const { user } = useUser();

  const [caption, setCaption] = useState("");
  const [selectImage, setSelectImage] = useState<string | null>(null);
  const [isSharing, setIsSharing] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    })

    if(!result.canceled) setSelectImage(result.assets[0].uri)
  }

  const generateUploadUrl = useMutation(api.functions.posts.generateUploadUrl)
  const createPost = useMutation(api.functions.posts.createPost)

  const handleShare = async () => {
    if (!selectImage) return;

    try {
      setIsSharing(true)
      const uploadUrl = await generateUploadUrl();

      const uploadResult = await FileSystem.uploadAsync(uploadUrl,
        selectImage, {
          httpMethod: "POST",
          uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT,
          mimeType: "image/jpeg",
        });

        if(uploadResult.status !== 200) throw new Error("Upload Failed")

        const { storageId } = JSON.parse(uploadResult.body);
        await createPost({storageId, caption})

        router.push("/(tabs)/profile")

    } catch (err) {
      console.log("Error uploading post")
    } finally {
      setIsSharing(false);
    }
  }


  if (!selectImage) {
    return (
      <View style={styless.container}>
        <View style={styless.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={28} color={COLORS.primary}/>
          </TouchableOpacity>
          <Text style={styless.headerTitle}>New Post</Text>
          <View style={{ width: 28}} />
        </View>

        <TouchableOpacity onPress={pickImage} style={styless.emptyImageContainer}>
          <Ionicons name="image-outline" size={48} color={COLORS.primary}/>
          <Text style={styless.headerTitle}>Tap to select an image.</Text>
        </TouchableOpacity>
        <View style={{width: 28}}/>
      </View>
    )
  }
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styless.container}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
    >
      <View style={styless.contentContainer}>

        <View style={styless.header}>
          <TouchableOpacity
            onPress={() => {
              setSelectImage(null);
              setCaption("");
            }}
            disabled={isSharing}
            >
            <Ionicons 
              name="close-outline"
              size={28}
              color={isSharing ? COLORS.grey : COLORS.white}
              />
          </TouchableOpacity>
          <Text style={styless.headerTitle}>New Post</Text>
          <TouchableOpacity
            style={[styless.shareButton, isSharing && styless.shareButtonDisabled]}
            disabled={isSharing || !selectImage}
            onPress={handleShare}
            >
            {isSharing ? (
              <ActivityIndicator size='small' color={COLORS.primary} />
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
          <View
            style={[styless.content, isSharing && styless.contentDisabled]}
          >
            {/* Image Section */}
            <View style={styless.imageSection}>
              <Image 
                source={selectImage}
                style={styless.previewImage}
                contentFit='cover'
                transition={200}
              />
              <TouchableOpacity
                style={styless.changeImageButton}
                onPress={pickImage}
                disabled={isSharing}
              >
                <Ionicons name="image-outline" size={20} color={COLORS.white}/>
                <Text style={styless.changeImageText}>Change</Text>
              </TouchableOpacity>
            </View>

            <View style={styless.inputSection}>
              <View style={styless.captionContainer}></View>
                <Image 
                  source={user?.imageUrl}
                  style={styless.userAvatar}
                  contentFit='cover'
                  transition={200}
                />
                <TextInput 
                  style={styless.captionInput}
                  placeholder='Write a caption'
                  placeholderTextColor={COLORS.grey}
                  multiline
                  value={caption}
                  onChangeText={setCaption}
                  editable={!isSharing}
                />
            </View>

          </View>

        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  )
}

const { width } = Dimensions.get("window");

const styless = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
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
    borderBottomColor: COLORS.surface,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.white,
  },
  contentDisabled: {
    opacity: 0.7,
  },
  shareButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    minWidth: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  shareButtonDisabled: {
    opacity: 0.5,
  },
  shareText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: "600",
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
    color: COLORS.white,
    fontSize: 16,
    paddingTop: 8,
    minHeight: 40,
  },
});
