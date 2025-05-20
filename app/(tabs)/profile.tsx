import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { useAuth, useUser } from '@clerk/clerk-expo';

export default function Profile() {
  const { user } = useUser();
  const { signOut } = useAuth();

   return (
    <View style={{ padding: 20 }}>
      {user ? (
        <>
          <Text style={{ fontSize: 18, marginBottom: 10 }}>
            Welcome, {user.fullName || user.username} 
          </Text>
          <Text>{JSON.stringify(user, null, 2)}</Text>
          <Text style={{ fontSize: 16, marginBottom: 20 }}>
            Email: {user.primaryEmailAddress?.emailAddress}
          </Text>
        </>
      ) : (
        <Text>Loading user...</Text>
      )}

      <TouchableOpacity onPress={() => signOut()}>
        <Text style={{ color: 'red', fontWeight: 'bold' }}>Log out</Text>
      </TouchableOpacity>
    </View>
  );
}