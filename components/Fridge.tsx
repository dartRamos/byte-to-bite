import { View, Text, Image } from 'react-native'
import { styles } from '../styles/auth.styles'
import { Link } from "expo-router";
import React from 'react'

export default function Fridge() {
  return (
    <View style={styles.container}>
      <Image 
        source={require("../assets/images/fridge.png")} 
        style={styles.fridge} />
    </View>
  )
}