import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet, Switch, Text, View } from 'react-native';
import { COLORS } from '../constants/Colors';

export default function SettingsScreen() {
  // --- State Placeholder ---
  // In a real app, this state would likely be tied to the actual
  // Bluetooth status of the device or a specific connection.
  const [isBluetoothEnabled, setIsBluetoothEnabled] = useState(true);

  const toggleBluetoothSwitch = () => {
    // TODO: Add logic to enable/disable Bluetooth or connect to a device.
    console.log(`Bluetooth toggled to: ${!isBluetoothEnabled}`);
    setIsBluetoothEnabled(previousState => !previousState);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>
      
      <View style={styles.content}>
        <View style={styles.settingItem}>
          <View style={styles.settingTextContainer}>
            <Ionicons name="bluetooth" size={24} color={COLORS.primary} style={styles.icon} />
            <Text style={styles.settingLabel}>Device Connectivity</Text>
          </View>
          <Switch
            trackColor={{ false: COLORS.gray, true: COLORS.primary }}
            thumbColor={isBluetoothEnabled ? COLORS.white : COLORS.lightGray}
            ios_backgroundColor={COLORS.lightGray}
            onValueChange={toggleBluetoothSwitch}
            value={isBluetoothEnabled}
          />
        </View>
        <Text style={styles.settingDescription}>
          {isBluetoothEnabled
            ? 'Ready to connect to your device.'
            : 'Enable to allow connection to your device.'}
        </Text>
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
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 16,
  },
  settingLabel: {
    fontSize: 18,
    color: COLORS.black,
  },
  settingDescription: {
    fontSize: 14,
    color: COLORS.gray,
    marginTop: 8,
    paddingLeft: 40, // Align with the label text
  },
});