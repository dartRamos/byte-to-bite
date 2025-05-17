import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import { useAuth } from '@clerk/clerk-expo'
import { Stack, useRouter, useSegments } from 'expo-router'

export default function InitialLayout() {
  const {isLoaded, isSignedIn} = useAuth(); // Checks with Clerk if it is loaded and if the user is signed in
  
  const segments = useSegments(); // lets you know what screen you are on
  const router = useRouter(); // lets you navigate to different screens

  useEffect(() => {
    if(!isLoaded) return;

    const inAuthPage = segments[0] === "(auth)"; // Checks if the user is on the auth page

    if(!isSignedIn && !inAuthPage) router.replace("/(auth)/login"); // If the user is not signed in and not on the auth page, redirect to login
    else if(isSignedIn && inAuthPage) router.replace("/(tabs)"); // If the user is signed in and on the auth page, redirect to the home page
  }, [isLoaded, isSignedIn, segments])

  return <Stack screenOptions={{ headerShown: false}} />; // used to manage the navigation stack
}