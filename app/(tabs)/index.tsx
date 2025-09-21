import React from 'react';
import { ImageBackground, Pressable, SafeAreaView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../constants/Colors';

// A more modern, reusable button component for our design
const ThemedButton = ({ title, onPress, color = COLORS.primary }: { title: string; onPress: () => void; color?: string }) => (
  <Pressable
    onPress={onPress}
    style={({ pressed }) => [
      styles.button,
      { backgroundColor: color, opacity: pressed ? 0.8 : 1 },
    ]}
  >
    <Text style={styles.buttonText}>{title}</Text>
  </Pressable>
);

export default function HomeScreen() {
  // --- Backend Logic Placeholder ---
  // In a real app, this state would come from a service that
  // communicates with your hardware device.
  const [isConnected, setIsConnected] = React.useState(true);

  const handleStartSession = () => {
    // TODO: Integrate with your session management logic.
    console.log('Starting new session...');
    // Example: api.startSession();
  };

  const handleScheduleSession = () => {
    // TODO: Navigate to a dedicated scheduling screen or show a modal.
    // With Expo Router, you might use: router.push('/schedule');
    console.log('Navigating to schedule session...');
  };

  const handleViewPastSessions = () => {
    // TODO: Navigate to a screen listing past sessions.
    // With Expo Router, you might use: router.push('/sessions');
    console.log('Navigating to past sessions...');
  };

  return (
    <ImageBackground
      source={require('../../assets/images/closeup-sport-shoes-concrete-path.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        {/* Overlay to ensure text readability */}
        <View style={styles.overlay}>
          <View style={styles.header}>
            <Text style={styles.title}>Home</Text>
            <Text style={styles.connectivityStatus}>
              Device Status:{' '}
              <Text style={{ color: isConnected ? COLORS.success : COLORS.error }}>
                {isConnected ? 'Connected' : 'Disconnected'}
              </Text>
            </Text>
          </View>

          <View style={styles.content}>
            <ThemedButton
              title="Start New Session"
              onPress={handleStartSession}
            />
            <ThemedButton
              title="Schedule a Session"
              onPress={handleScheduleSession}
              color={COLORS.secondary}
            />
            <ThemedButton
              title="View Past Sessions"
              onPress={handleViewPastSessions}
              color={COLORS.gray}
            />
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent', // Make container transparent to see the background
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // Dark overlay for text contrast
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'transparent', // Header is part of the overlay
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.white, // Change text to white for visibility on dark overlay
  },
  connectivityStatus: {
    fontSize: 16,
    color: COLORS.lightGray, // Lighter gray for better contrast
    marginTop: 8,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    gap: 16, // Use gap for modern spacing
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
});