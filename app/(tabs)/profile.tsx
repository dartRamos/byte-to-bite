import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import React from 'react';
import { useAuth, useUser } from '@clerk/clerk-expo';

export default function Profile() {
  const { signOut } = useAuth();
  const { user, isLoaded } = useUser();

  // 1. Show loading state
  if (!isLoaded) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading your profile...</Text>
      </View>
    );
  }

  // 2. Handle case where user is not signed in
  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>No user found. Please sign in.</Text>
      </View>
    );
  }

  // 3. Show user profile
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {user.imageUrl ? (
          <Image source={{ uri: user.imageUrl }} style={styles.avatar} />
        ) : (
          <Text style={styles.avatarEmoji}>👤</Text>
        )}

        <Text style={styles.name}>Hello, {user.fullName || 'Mystery Human'}</Text>
        <Text style={styles.email}>{user.primaryEmailAddress?.emailAddress}</Text>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={signOut}>
        <Text style={styles.logoutButtonText}>🔵 Log Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
  },
  card: {
    backgroundColor: '#FFFFFF',
    width: '100%',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    marginBottom: 30,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 16,
  },
  avatarEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: '#6B7280',
  },
  logoutButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 999,
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});