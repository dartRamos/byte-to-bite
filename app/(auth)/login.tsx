import { COLORS } from '@/constants/theme'
import { useSSO } from '@clerk/clerk-expo'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { Text, TouchableOpacity, View, Image, Dimensions, StyleSheet } from 'react-native'

export default function login() {
  
  const {startSSOFlow} = useSSO()
  const router = useRouter()
  
  const handlePress = async () => {
    try {
      const {createdSessionId, setActive} = await startSSOFlow({strategy:'oauth_google'})

      if(setActive && createdSessionId) {
        setActive({session: createdSessionId})
        router.replace('/(tabs)')
      }
    } catch (err) {
      console.log("OAunt error:", err)
    }
  }
 
  return (
    <View style={styles.container}>  
      {/* Brand Section */}
      <View style={styles.brandSection}>
        <Image source={require("../../assets/images/logo.png")} style={styles.logoImage} />
        <Text style={styles.tagline}>one bite is never enough!</Text>
        </View>

        {/* Image Source */}
        <View style={styles.illustrationContainer}>
          <Image source={require('../../assets/images/monster.png')} 
          style={styles.illustration} resizeMode='contain'/>
        </View>

        {/* Login Section */}
        <View style={styles.loginSection}>
          <TouchableOpacity
            style={styles.googleButton}
            onPress={handlePress}
            activeOpacity={0.9}
          >
            <View style={styles.googleIconContainer}>
              <Ionicons name="logo-google" size={20} color={COLORS.surface} />
            </View>
            <Text style={styles.googleButtonText}>Login with Google</Text>    
          </TouchableOpacity>

          <Text style={styles.termsText}>
            By continuing, you agree to our <Text style={{color: "#ff7043"}}>Terms of Service</Text> and <Text style={{color: "#ff7043"}}>Privacy Policy</Text>
          </Text>
        </View>
    </View>
  )
}

const { width, height } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF8C4",
    alignItems: 'center',
  },
  brandSection: {
    alignItems: "center",
    marginTop: height * 0.12,
  },
  logoImage: {
    width: 500,
    height: 110,
    marginBottom: 12,
  },
  tagline: {
    fontSize: 16,
    color: "#ff7043",
    letterSpacing: 1,
    fontFamily: "Pencil",
  },
  illustrationContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  illustration: {
    width: 900,
    height: 900,
    marginTop: -50,
    marginRight: -50,
  },
  loginSection: {
    width: "100%",
    paddingHorizontal: 24,
    paddingBottom: 40,
    alignItems: "center",
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.white,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 14,
    marginBottom: 20,
    width: "100%",
    maxWidth: 300,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  googleIconContainer: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.surface,
  },
  termsText: {
    textAlign: "center",
    fontSize: 12,
    color: COLORS.grey,
    maxWidth: 280,
  },
});