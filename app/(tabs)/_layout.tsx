import { Tabs } from 'expo-router'
import { Ionicons } from "@expo/vector-icons"
import { COLORS } from '@/constants/theme'

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        headerShown: false,
        tabBarActiveTintColor: '#d4af37',
        tabBarInactiveTintColor: COLORS.grey,
        tabBarStyle: {
          backgroundColor: "rgba(107, 76, 29, 1)",
          borderTopWidth: 0,
          position: "absolute",
          elevation: 0,
          height: 40,
          paddingBottom: 8,
        }
      }}
    >
      <Tabs.Screen name="index"
        
        options={{
          tabBarIcon: ({size,color}) => <Ionicons name="home" size={size} color={color}
          /> 
        }}
      />
      <Tabs.Screen name="favorites"
      
      options={{
        tabBarIcon: ({size,color}) => <Ionicons name="heart" size={size} color={color}
        /> 
      }}
      />
      <Tabs.Screen name="create"
      
      options={{
        tabBarIcon: ({size,color}) => <Ionicons name="add-circle" size={size} color={color}
        /> 
      }}
      />
      <Tabs.Screen name="profile"
      
      options={{
        tabBarIcon: ({size,color}) => <Ionicons name="person-circle" size={size} color={color}
        /> 
      }}
      />
      <Tabs.Screen name="feed"
      
        options={{
        tabBarIcon: ({size,color}) => <Ionicons name="list-circle" size={size} color={color}
        /> 
      }}
      />
    </Tabs>
  )
}