import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator } from 'react-native';

interface User {
  id: number;
  username: string;
}

const Index: React.FC = () => {
  const [userId, setUserId] = useState<string>('');
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const fetchUserData = async () => {
    if (!userId) {
      setError('Please enter a user ID');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);
      const data: User = await response.json();
      if (data.id) {
        setUserData(data);
      } else {
        setUserData(null);
        setError('User not found');
      }
    } catch (error) {
      setError('Failed to fetch user data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter User ID"
        value={userId}
        onChangeText={setUserId}
        keyboardType="numeric"
      />
      <Button title="Fetch" onPress={fetchUserData} />
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      {error && <Text style={styles.error}>{error}</Text>}
      {userData && (
        <Text style={styles.username}>{userData.username}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  input: {
    width: '80%',
    padding: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    color: '#333',
  },
  error: {
    color: 'red',
    marginTop: 10,
  },
});

export default Index;
