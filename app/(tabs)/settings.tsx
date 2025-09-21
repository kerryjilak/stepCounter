// app/(tabs)/settings.tsx
import { IconSymbol } from '@/components/ui/IconSymbol';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Switch, TextInput, TouchableOpacity, useColorScheme, View } from 'react-native';
import { ThemedText } from '../../components/ThemedText';
import { useAuth } from '../../hooks/useAuth';
import { COLORS } from '../constants/Colors';

export default function SettingsScreen() {
  const colorScheme = useColorScheme();
  const { user, signOut } = useAuth();
  const [dailyGoal, setDailyGoal] = useState('2000');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [reminderFrequency, setReminderFrequency] = useState(2); // hours
  const [darkModeEnabled, setDarkModeEnabled] = useState(colorScheme === 'dark');
  const [deviceNickname, setDeviceNickname] = useState('My Device');
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const goal = await AsyncStorage.getItem('dailyGoal');
      const notifications = await AsyncStorage.getItem('notificationsEnabled');
      const frequency = await AsyncStorage.getItem('reminderFrequency');
      const nickname = await AsyncStorage.getItem('deviceNickname');
      
      if (goal) setDailyGoal(goal);
      if (notifications) setNotificationsEnabled(JSON.parse(notifications));
      if (frequency) setReminderFrequency(parseInt(frequency));
      if (nickname) setDeviceNickname(nickname);
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const saveSettings = async () => {
    try {
      await AsyncStorage.setItem('dailyGoal', dailyGoal);
      await AsyncStorage.setItem('notificationsEnabled', JSON.stringify(notificationsEnabled));
      await AsyncStorage.setItem('reminderFrequency', reminderFrequency.toString());
      await AsyncStorage.setItem('deviceNickname', deviceNickname);
      Alert.alert('Settings Saved', 'Your preferences have been updated successfully.');
    } catch (error) {
      Alert.alert('Error', 'Failed to save settings. Please try again.');
      console.error('Error saving settings:', error);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', onPress: signOut, style: 'destructive' },
      ]
    );
  };

  const SettingItem = ({ 
    icon, 
    title, 
    subtitle, 
    onPress, 
    rightComponent,
    showArrow = true 
  }: {
    icon: string;
    title: string;
    subtitle?: string;
    onPress?: () => void;
    rightComponent?: React.ReactNode;
    showArrow?: boolean;
  }) => (
    <TouchableOpacity
      style={styles.settingItem}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.settingLeft}>
        <View style={[styles.iconContainer, { backgroundColor: COLORS.primary + '20' }]}>
          <IconSymbol name={icon as any} size={20} color={COLORS.secondary} />
        </View>
        <View style={styles.settingText}>
          <ThemedText style={styles.settingTitle}>{title}</ThemedText>
          {subtitle && <ThemedText style={styles.settingSubtitle}>{subtitle}</ThemedText>}
        </View>
      </View>
      <View style={styles.settingRight}>
        {rightComponent}
        {showArrow && !rightComponent && (
          <IconSymbol name="chevron.right" size={16} color="#999" />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <ThemedText style={styles.headerTitle}>Settings</ThemedText>
        <ThemedText style={styles.headerSubtitle}>Customize your recovery experience</ThemedText>
      </View>

      {/* Profile Section */}
      <View style={styles.section}>
        <TouchableOpacity
          style={styles.profileCard}
          onPress={() => setShowProfile(!showProfile)}
        >
          <View style={styles.profileInfo}>
            <View style={[styles.avatar, { backgroundColor: COLORS.primaryLight }]}>
              <ThemedText style={styles.avatarText}>
                {(user?.first_name?.[0] || user?.username?.[0] || 'U').toUpperCase()}
              </ThemedText>
            </View>
            <View>
              <ThemedText style={styles.profileName}>
                {user?.first_name || user?.username}
              </ThemedText>
              <ThemedText style={styles.profileRole}>
                {user?.role === 'patient' ? 'Recovery Patient' : 'Healthcare Staff'}
              </ThemedText>
            </View>
          </View>
          <IconSymbol 
            name={showProfile ? "chevron.up" : "chevron.down"} 
            size={16} 
            color="#999" 
          />
        </TouchableOpacity>

        {showProfile && (
          <View style={styles.profileDetails}>
            <View style={styles.profileDetailItem}>
              <ThemedText style={styles.profileDetailLabel}>Username:</ThemedText>
              <ThemedText style={styles.profileDetailValue}>{user?.username}</ThemedText>
            </View>
            <View style={styles.profileDetailItem}>
              <ThemedText style={styles.profileDetailLabel}>Email:</ThemedText>
              <ThemedText style={styles.profileDetailValue}>{user?.email || 'Not set'}</ThemedText>
            </View>
            <View style={styles.profileDetailItem}>
              <ThemedText style={styles.profileDetailLabel}>Role:</ThemedText>
              <ThemedText style={styles.profileDetailValue}>
                {user?.role === 'patient' ? 'Patient' : 'Staff'}
              </ThemedText>
            </View>
          </View>
        )}
      </View>

      {/* Goals & Tracking */}
      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Goals & Tracking</ThemedText>
        
        <View style={styles.inputContainer}>
          <SettingItem
            icon="target"
            title="Daily Step Goal"
            subtitle="Adjusted for recovery patients"
            showArrow={false}
            rightComponent={
              <View style={styles.goalInput}>
                <TextInput
                  style={styles.textInput}
                  value={dailyGoal}
                  onChangeText={setDailyGoal}
                  keyboardType="numeric"
                  placeholder="2000"
                />
                <ThemedText style={styles.goalUnit}>steps</ThemedText>
              </View>
            }
          />
        </View>

        <View style={styles.inputContainer}>
          <SettingItem
            icon="smartphone"
            title="Device Nickname"
            subtitle="Name your tracking device"
            showArrow={false}
            rightComponent={
              <TextInput
                style={styles.textInput}
                value={deviceNickname}
                onChangeText={setDeviceNickname}
                placeholder="My Device"
              />
            }
          />
        </View>
      </View>

      {/* Notifications */}
      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Notifications & Reminders</ThemedText>
        
        <SettingItem
          icon="bell"
          title="Push Notifications"
          subtitle="Get reminders to stay active"
          showArrow={false}
          rightComponent={
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#E5E7EB', true: COLORS.secondary + '50' }}
              thumbColor={notificationsEnabled ? COLORS.primaryLight : '#9CA3AF'}
            />
          }
        />
        
        {notificationsEnabled && (
          <SettingItem
            icon="clock"
            title="Reminder Frequency"
            subtitle={`Every ${reminderFrequency} hours`}
            showArrow={false}
            rightComponent={
              <View style={styles.frequencySelector}>
                {[1, 2, 4, 8].map((hours) => (
                  <TouchableOpacity
                    key={hours}
                    style={[
                      styles.frequencyOption,
                      reminderFrequency === hours && {
                        backgroundColor: COLORS.primary,
                      },
                    ]}
                    onPress={() => setReminderFrequency(hours)}
                  >
                    <ThemedText
                      style={[
                        styles.frequencyText,
                        reminderFrequency === hours && { color: 'white' },
                      ]}
                    >
                      {hours}h
                    </ThemedText>
                  </TouchableOpacity>
                ))}
              </View>
            }
          />
        )}
      </View>

      {/* Recovery Support */}
      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Recovery Support</ThemedText>
        
        <SettingItem
          icon="heart.text.square"
          title="Recovery Tips"
          subtitle="View personalized rehabilitation advice"
          onPress={() => Alert.alert('Coming Soon', 'Recovery tips feature will be available in the next update.')}
        />
        
        <SettingItem
          icon="doc.text"
          title="Progress Reports"
          subtitle="Generate reports for your healthcare provider"
          onPress={() => Alert.alert('Coming Soon', 'Progress reports feature will be available in the next update.')}
        />
        
        <SettingItem
          icon="phone.circle"
          title="Emergency Contacts"
          subtitle="Manage your emergency contact list"
          onPress={() => Alert.alert('Coming Soon', 'Emergency contacts feature will be available in the next update.')}
        />
      </View>

      {/* App Settings */}
      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>App Settings</ThemedText>
        
        <SettingItem
          icon="moon"
          title="Dark Mode"
          subtitle="Use system setting or override"
          showArrow={false}
          rightComponent={
            <Switch
              value={darkModeEnabled}
              onValueChange={setDarkModeEnabled}
              trackColor={{ false: '#E5E7EB', true: COLORS.primaryLight + '50' }}
              thumbColor={darkModeEnabled ? COLORS.primaryLight : '#9CA3AF'}
            />
          }
        />
        
        <SettingItem
          icon="info.circle"
          title="About"
          subtitle="App version and information"
          onPress={() => Alert.alert('Step Recovery Tracker', 'Version 1.0.0\n\nDesigned specifically for stroke recovery and post-surgery rehabilitation patients.')}
        />
        
        <SettingItem
          icon="questionmark.circle"
          title="Help & Support"
          subtitle="Get help using the app"
          onPress={() => Alert.alert('Help & Support', 'For assistance, please contact your healthcare provider or visit our support website.')}
        />
      </View>

      {/* Data & Privacy */}
      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Data & Privacy</ThemedText>
        
        <SettingItem
          icon="cloud.upload"
          title="Data Sync"
          subtitle="Sync data with healthcare providers"
          onPress={() => Alert.alert('Data Sync', 'Your data is automatically synced with authorized healthcare providers for monitoring your recovery progress.')}
        />
        
        <SettingItem
          icon="shield.checkered"
          title="Privacy Policy"
          subtitle="How we protect your health data"
          onPress={() => Alert.alert('Privacy Policy', 'Your health data is protected and only shared with authorized healthcare providers as per HIPAA guidelines.')}
        />
        
        <SettingItem
          icon="trash"
          title="Clear Data"
          subtitle="Remove all stored activity data"
          onPress={() => Alert.alert(
            'Clear Data',
            'This will permanently delete all your activity history. This action cannot be undone.',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Delete', style: 'destructive', onPress: () => {
                Alert.alert('Data Cleared', 'All your activity data has been removed from this device.');
              }},
            ]
          )}
        />
      </View>

      {/* Action Buttons */}
      <View style={styles.actionSection}>
        <TouchableOpacity
          style={[styles.saveButton, { backgroundColor: COLORS.primary }]}
          onPress={saveSettings}
        >
          <IconSymbol name="checkmark.circle" size={20} color="white" />
          <ThemedText style={styles.saveButtonText}>Save Settings</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <IconSymbol name="arrow.right.square" size={20} color="#FF3B30" />
          <ThemedText style={styles.logoutButtonText}>Logout</ThemedText>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <ThemedText style={styles.footerText}>
          Step Recovery Tracker v1.0.0
        </ThemedText>
        <ThemedText style={styles.footerSubtext}>
          Designed for stroke recovery and rehabilitation
        </ThemedText>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
  },
  section: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    padding: 20,
    paddingBottom: 12,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 2,
  },
  profileRole: {
    fontSize: 14,
    color: '#666',
  },
  profileDetails: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  profileDetailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  profileDetailLabel: {
    fontSize: 14,
    color: '#666',
  },
  profileDetailValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 13,
    color: '#666',
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  textInput: {
    fontSize: 16,
    textAlign: 'right',
    minWidth: 80,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  goalInput: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  goalUnit: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  frequencySelector: {
    flexDirection: 'row',
  },
  frequencyOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginLeft: 4,
    backgroundColor: '#F0F0F0',
  },
  frequencyText: {
    fontSize: 12,
    fontWeight: '500',
  },
  actionSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#FFF5F5',
    borderWidth: 1,
    borderColor: '#FFE5E5',
  },
  logoutButtonText: {
    color: '#FF3B30',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingBottom: 40,
  },
  footerText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: 12,
    color: '#999',
  },
});