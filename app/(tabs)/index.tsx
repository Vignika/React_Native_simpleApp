import React, { useState, useRef } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';

interface User {
  id: number;
  username: string;
  name: string;
  email: string;
  phone: string;
}

const Index: React.FC = () => {
  const [userId, setUserId] = useState<string>('');
  const [userData, setUserData] = useState<User | null>(null);
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

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
        setShowDetails(false); // Reset details display
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

  const handlePressIn = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setShowDetails(true);
  };

  const handlePressOut = () => {
    timeoutRef.current = setTimeout(() => {
      setShowDetails(false);
    }, 2000); // 2 seconds delay
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
        <TouchableOpacity
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
        >
          <Text style={styles.username}>{userData.username}</Text>
          {showDetails && (
            <Text style={styles.details}>
              Name: {userData.name}{"\n"}
              Email: {userData.email}{"\n"}
              Phone: {userData.phone}
            </Text>
          )}
        </TouchableOpacity>
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
  details: {
    marginTop: 10,
    color: '#555',
  },
  error: {
    color: 'red',
    marginTop: 10,
  },
});

export default Index;
