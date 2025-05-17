import { Redirect } from 'expo-router'
import React from 'react'

export default function Index() {
  return <Redirect href="/(auth)/login" />; // Redirects to the login page
}