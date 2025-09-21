import { IconSymbol } from '@/components/ui/IconSymbol';
import { LinearGradient } from 'expo-linear-gradient';
import { Pedometer } from 'expo-sensors';
import { useEffect, useState } from 'react';
import { Alert, Dimensions, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '../../components/ThemedText';
import { useAuth } from '../../hooks/useAuth';
import { COLORS } from '../constants/Colors';
import { apiService } from '../../services/api';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const { user } = useAuth();
  const [currentSteps, setCurrentSteps] = useState(0);
  const [dailyGoal, setDailyGoal] = useState(8000);
  const [weeklyAverage, setWeeklyAverage] = useState(0);
  const [isAvailable, setIsAvailable] = useState(false);

  useEffect(() => {
    initializePedometer();
  }, []);

  const initializePedometer = async () => {
    const available = await Pedometer.isAvailableAsync();
    setIsAvailable(available);

    if (available) {
      // Get today's steps
      const end = new Date();
      const start = new Date();
      start.setHours(0, 0, 0, 0);

      try {
        const result = await Pedometer.getStepCountAsync(start, end);
        setCurrentSteps(result.steps);

        // Calculate weekly average
        const weekStart = new Date();
        weekStart.setDate(weekStart.getDate() - 7);
        const weekResult = await Pedometer.getStepCountAsync(weekStart, end);
        setWeeklyAverage(Math.round(weekResult.steps / 7));
      } catch (error) {
        console.error('Pedometer error:', error);
      }
    }
  };

  const uploadSteps = async () => {
    try {
      await apiService.uploadStepData({
        device_id: 'default-device',
        timestamp: new Date().toISOString(),
        step_count: currentSteps,
      });
      Alert.alert('Success', 'Steps uploaded successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to upload steps');
    }
  };

  const progressPercentage = Math.min((currentSteps / dailyGoal) * 100, 100);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <ThemedText style={styles.greeting}>
          Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'}
        </ThemedText>
        <ThemedText style={styles.username}>{user?.first_name || user?.username || 'User'}</ThemedText>
      </View>

      {/* Main Step Counter Card */}
      <LinearGradient
        colors={[COLORS.gradientStart, COLORS.gradientEnd]}
        style={styles.mainCard}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.stepCountContainer}>
          <ThemedText style={styles.stepCount}>{currentSteps.toLocaleString()}</ThemedText>
          <ThemedText style={styles.stepLabel}>Steps Today</ThemedText>
        </View>
        
        {/* Progress Ring */}
        <View style={styles.progressContainer}>
          <View style={styles.progressRing}>
            <View style={[styles.progressFill, { width: `${progressPercentage}%` }]} />
          </View>
          <ThemedText style={styles.progressText}>
            {Math.round(progressPercentage)}% of goal
          </ThemedText>
        </View>
      </LinearGradient>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <IconSymbol name="target" size={24} color={COLORS.primary} />
          <ThemedText style={styles.statValue}>{dailyGoal.toLocaleString()}</ThemedText>
          <ThemedText style={styles.statLabel}>Daily Goal</ThemedText>
        </View>
        
        <View style={styles.statCard}>
          <IconSymbol name="chart.bar" size={24} color={COLORS.secondary} />
          <ThemedText style={styles.statValue}>{weeklyAverage.toLocaleString()}</ThemedText>
          <ThemedText style={styles.statLabel}>Weekly Avg</ThemedText>
        </View>
      </View>

      {/* Action Button */}
      <TouchableOpacity style={styles.uploadButton} onPress={uploadSteps}>
        <IconSymbol name="icloud.and.arrow.up" size={20} color={COLORS.white} />
        <ThemedText style={styles.uploadButtonText}>Sync Steps</ThemedText>
      </TouchableOpacity>

      {/* Status */}
      {!isAvailable && (
        <View style={styles.statusCard}>
          <IconSymbol name="exclamationmark.triangle" size={20} color={COLORS.warning} />
          <ThemedText style={styles.statusText}>Pedometer not available on this device</ThemedText>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
  },
  greeting: {
    fontSize: 16,
    color: COLORS.gray,
    fontWeight: '500',
  },
  username: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.black,
    marginTop: 4,
  },
  mainCard: {
    marginHorizontal: 24,
    marginBottom: 24,
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
  },
  stepCountContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  stepCount: {
    fontSize: 48,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  stepLabel: {
    fontSize: 16,
    color: COLORS.white,
    opacity: 0.9,
    marginTop: 4,
  },
  progressContainer: {
    width: '100%',
    alignItems: 'center',
  },
  progressRing: {
    width: '100%',
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.white,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: COLORS.white,
    opacity: 0.9,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 24,
    gap: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.black,
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.gray,
    marginTop: 4,
  },
  uploadButton: {
    marginHorizontal: 24,
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  uploadButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  statusCard: {
    marginHorizontal: 24,
    backgroundColor: COLORS.warning + '20',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  statusText: {
    color: COLORS.warning,
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
});