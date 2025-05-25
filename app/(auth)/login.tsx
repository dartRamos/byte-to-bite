import { COLORS } from '@/constants/theme'
import { useSSO } from '@clerk/clerk-expo'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { Text, TouchableOpacity, View, Image } from 'react-native'
import { styles } from '../../styles/auth.styles'

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
            By continuing, you agree to our <Text style={{color: COLORS.primary}}>Terms of Service</Text> and <Text style={{color: COLORS.primary}}>Privacy Policy</Text>
          </Text>
        </View>
    </View>
  )
}