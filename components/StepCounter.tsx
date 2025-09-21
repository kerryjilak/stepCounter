import { LinearGradient } from 'expo-linear-gradient';
import { Pedometer } from 'expo-sensors';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native';
import { COLORS } from '../app/constants/Colors';
import { apiService } from '../services/api';
import { ThemedText } from './ThemedText';
import { IconSymbol } from './ui/IconSymbol';

interface StepCounterProps {
  deviceId: string;
  onStepsUpdate?: (steps: number) => void;
}

export const StepCounter: React.FC<StepCounterProps> = ({ deviceId, onStepsUpdate }) => {
  const [currentStepCount, setCurrentStepCount] = useState(0);
  const [dailyGoal, setDailyGoal] = useState(8000);
  const [isPedometerAvailable, setIsPedometerAvailable] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const subscriptionRef = useRef<any>(null)

   useEffect(() => {
    initializePedometer();
    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.remove();
      }
    };
  }, []);


  const initializePedometer = async () => {
    const isAvailable = await Pedometer.isAvailableAsync();
    setIsPedometerAvailable(isAvailable);

    if (isAvailable) {
      // Get today's steps
      const end = new Date();
      const start = new Date();
      start.setHours(0, 0, 0, 0);

      try {
        const result = await Pedometer.getStepCountAsync(start, end);
        setCurrentStepCount(result.steps);
        onStepsUpdate?.(result.steps);

        // Watch for step updates
        subscriptionRef.current = Pedometer.watchStepCount(result => {
          setCurrentStepCount(result.steps);
          onStepsUpdate?.(result.steps);
        });
      } catch (error) {
        console.error('Pedometer error:', error);
      }
    }
  };

  const uploadStepData = async () => {
    if (isUploading) return;
    
    try {
      setIsUploading(true);
      await apiService.uploadStepData({
        device_id: deviceId,
        timestamp: new Date().toISOString(),
        step_count: currentStepCount,
      });
      Alert.alert('Success', 'Step data synced successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to sync step data');
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const progressPercentage = Math.min((currentStepCount / dailyGoal) * 100, 100);

  if (!isPedometerAvailable) {
    return (
      <View style={styles.unavailableContainer}>
        <IconSymbol name="exclamationmark.triangle" size={32} color={COLORS.warning} />
        <ThemedText style={styles.unavailableText}>
          Step tracking is not available on this device
        </ThemedText>
      </View>
    );
  }

  return (
    <LinearGradient
      colors={[COLORS.gradientStart, COLORS.gradientEnd]}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.content}>
        {/* Step Count Display */}
        <View style={styles.stepDisplay}>
          <ThemedText style={styles.stepCount}>
            {currentStepCount.toLocaleString()}
          </ThemedText>
          <ThemedText style={styles.stepLabel}>Steps Today</ThemedText>
        </View>

        {/* Progress Indicator */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progressPercentage}%` }]} />
          </View>
          <ThemedText style={styles.progressText}>
            {Math.round(progressPercentage)}% of {dailyGoal.toLocaleString()} goal
          </ThemedText>
        </View>

        {/* Sync Button */}
        <TouchableOpacity 
          style={[styles.syncButton, isUploading && styles.syncButtonDisabled]} 
          onPress={uploadStepData}
          disabled={isUploading}
        >
          <IconSymbol 
            name={isUploading ? "arrow.clockwise" : "icloud.and.arrow.up"} 
            size={18} 
            color={COLORS.primary} 
          />
          <ThemedText style={styles.syncButtonText}>
            {isUploading ? 'Syncing...' : 'Sync Steps'}
          </ThemedText>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    padding: 24,
    margin: 16,
  },
  content: {
    alignItems: 'center',
  },
  stepDisplay: {
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
    marginBottom: 24,
  },
  progressBar: {
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
  syncButton: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
  },
  syncButtonDisabled: {
    opacity: 0.7,
  },
  syncButtonText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
 // ...existing code...
  unavailableContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 32,
    margin: 16,
    alignItems: 'center',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 }, // <-- fix here
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
// ...existing code...,
  unavailableText: {
    fontSize: 16,
    color: COLORS.gray,
    textAlign: 'center',
    marginTop: 12,
  },
});