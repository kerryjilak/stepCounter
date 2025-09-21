import { Ionicons } from '@expo/vector-icons';
import { ComponentProps } from 'react';
import { Alert, Pressable, SafeAreaView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../constants/Colors';

type IoniconName = ComponentProps<typeof Ionicons>['name'];

// This is a placeholder for a real user object you'd get from your backend
const user = {
  name: 'John Doe',
  email: 'john.doe@example.com',
};

type ThemedButtonProps = {
  title: string;
  onPress: () => void;
  color?: string;
  iconName?: IoniconName;
};

const ThemedButton = ({ title, onPress, color = COLORS.primary, iconName }: ThemedButtonProps) => (
  <Pressable
    onPress={onPress}
    style={({ pressed }) => [
      styles.button,
      { backgroundColor: color, opacity: pressed ? 0.8 : 1 },
    ]}
  >
    {iconName && <Ionicons name={iconName} size={20} color={COLORS.white} style={styles.buttonIcon} />}
    <Text style={styles.buttonText}>{title}</Text>
  </Pressable>
);

export default function AccountScreen() {
  const handleLogout = () => {
    // In a real app, you would clear user tokens and navigate to a login screen.
    // For now, we'll just show an alert.
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Log Out', onPress: () => console.log('User logged out'), style: 'destructive' },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.title}>My Account</Text>
      </View>
      
      <View style={styles.content}>
        <View style={styles.infoSection}>
          <Text style={styles.infoLabel}>Name</Text>
          <Text style={styles.infoValue}>{user.name}</Text>
        </View>
        <View style={styles.infoSection}>
          <Text style={styles.infoLabel}>Email</Text>
          <Text style={styles.infoValue}>{user.email}</Text>
        </View>

        <View style={styles.logoutButtonContainer}>
          <ThemedButton
            title="Log Out"
            onPress={handleLogout}
            color={COLORS.error}
            iconName="log-out-outline"
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  infoSection: {
    marginBottom: 24,
  },
  infoLabel: {
    fontSize: 16,
    color: COLORS.gray,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 18,
    color: COLORS.black,
    fontWeight: '500',
  },
  logoutButtonContainer: {
    marginTop: 'auto', // Pushes the button to the bottom
    paddingBottom: 30,
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  buttonIcon: {
    marginRight: 10,
  },
});