// app/(tabs)/history.tsx (renamed from explore.tsx)
import { IconSymbol } from '@/components/ui/IconSymbol';
import { apiService } from '@/services/api';
import { StepData } from '@/types/api';
import { useEffect, useState } from 'react';
import { Dimensions, RefreshControl, ScrollView, StyleSheet, TouchableOpacity, useColorScheme, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { ThemedText } from '../../components/ThemedText';
import { COLORS } from '../constants/Colors';

const screenWidth = Dimensions.get('window').width;

interface SessionData {
  id: number;
  date: string;
  steps: number;
  duration: number; // in minutes
  avgPace: number; // steps per minute
  distance: number; // in meters (approximate)
}

interface Statistics {
  totalSteps: number;
  avgSteps: number;
  bestDay: number;
  consistency: number;
}


export default function HistoryScreen() {
  const colorScheme = useColorScheme();
  const [stepHistory, setStepHistory] = useState<StepData[]>([]);
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('week');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadHistoryData();
  }, []);

  const loadHistoryData = async () => {
    try {
      setIsLoading(true);
      const stepData = await apiService.getStepData();
      setStepHistory(stepData);

      // Transform step data into sessions
      const transformedSessions = stepData.map((step, index) => ({
        id: step.id,
        date: new Date(step.timestamp).toLocaleDateString(),
        steps: step.step_count,
        duration: Math.max(30, Math.round(step.step_count * 0.8 / 60)), // Approximate duration
        avgPace: Math.round(step.step_count / Math.max(30, step.step_count * 0.8 / 60)),
        distance: Math.round(step.step_count * 0.762), // Approximate distance in meters
      }));

      setSessions(transformedSessions.slice(0, 10)); // Show last 10 sessions
    } catch (error) {
      console.error('Failed to load history data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setIsRefreshing(true);
    await loadHistoryData();
    setIsRefreshing(false);
  };

  const getChartData = () => {
    if (stepHistory.length === 0) {
      return {
        labels: ['No Data'],
        datasets: [{ data: [0] }],
      };
    }

    const last7Days = stepHistory.slice(0, 7).reverse();
    return {
      labels: last7Days.map(data =>
        new Date(data.timestamp).toLocaleDateString('en', { weekday: 'short' })
      ),
      datasets: [
        {
          data: last7Days.map(data => data.step_count),
          color: (opacity = 1) => `rgba(74, 144, 226, ${opacity})`,
          strokeWidth: 3,
        },
      ],
    };
  };

  const getStatistics = (): Statistics => {
    if (stepHistory.length === 0) {
      return { 
        totalSteps: 0, 
        avgSteps: 0, 
        bestDay: 0, 
        consistency: 0 
      };
    }
  
    const totalSteps = stepHistory.reduce((sum, data) => sum + data.step_count, 0);
    const avgSteps = Math.round(totalSteps / stepHistory.length);
    const bestDay = Math.max(...stepHistory.map(data => data.step_count));
    const daysWithSteps = stepHistory.filter(data => data.step_count > 100).length;
    const consistency = Math.round((daysWithSteps / stepHistory.length) * 100);
  
    return { totalSteps, avgSteps, bestDay, consistency };
  };

    const statistics = getStatistics();

    const renderSession = (session: SessionData) => (
      <TouchableOpacity key={session.id} style={styles.sessionCard}>
        <View style={styles.sessionHeader}>
          <View style={styles.sessionDate}>
            <IconSymbol name="calendar" size={16} color={COLORS.primary} />
            <ThemedText style={styles.sessionDateText}>{session.date}</ThemedText>
          </View>
          <View style={[styles.sessionBadge, { backgroundColor: session.steps > 2000 ? '#34C759' : '#FFB800' }]}>
            <ThemedText style={styles.sessionBadgeText}>
              {session.steps > 2000 ? 'Goal Met' : 'In Progress'}
            </ThemedText>
          </View>
        </View>

        <View style={styles.sessionStats}>
          <View style={styles.sessionStat}>
            <IconSymbol name="figure.walk" size={20} color="#4A90E2" />
            <ThemedText style={styles.sessionStatValue}>{session.steps.toLocaleString()}</ThemedText>
            <ThemedText style={styles.sessionStatLabel}>Steps</ThemedText>
          </View>

          <View style={styles.sessionStat}>
            <IconSymbol name="clock" size={20} color="#FF6B35" />
            <ThemedText style={styles.sessionStatValue}>{session.duration}'</ThemedText>
            <ThemedText style={styles.sessionStatLabel}>Duration</ThemedText>
          </View>

          <View style={styles.sessionStat}>
            <IconSymbol name="speedometer" size={20} color="#34C759" />
            <ThemedText style={styles.sessionStatValue}>{session.avgPace}</ThemedText>
            <ThemedText style={styles.sessionStatLabel}>Avg Pace</ThemedText>
          </View>

          <View style={styles.sessionStat}>
            <IconSymbol name="location" size={20} color="#FF3B82" />
            <ThemedText style={styles.sessionStatValue}>{(session.distance / 1000).toFixed(1)}km</ThemedText>
            <ThemedText style={styles.sessionStatLabel}>Distance</ThemedText>
          </View>
        </View>
      </TouchableOpacity>
    );

    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ThemedText>Loading your activity history...</ThemedText>
        </View>
      );
    }

    return (
      <ScrollView
        style={styles.container}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
      >
        {/* Header */}
        <View style={styles.header}>
          <ThemedText style={styles.headerTitle}>Activity History</ThemedText>
          <ThemedText style={styles.headerSubtitle}>Track your recovery progress</ThemedText>
        </View>

        {/* Period Selector */}
        <View style={styles.periodSelector}>
          {(['week', 'month', 'year'] as const).map((period) => (
            <TouchableOpacity
              key={period}
              style={[
                styles.periodButton,
                selectedPeriod === period && {
                  backgroundColor: COLORS.primary,
                },
              ]}
              onPress={() => setSelectedPeriod(period)}
            >
              <ThemedText
                style={[
                  styles.periodButtonText,
                  selectedPeriod === period && { color: 'white' },
                ]}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </View>

        {/* Statistics Cards */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <IconSymbol name="chart.line.uptrend.xyaxis" size={24} color="#4A90E2" />
            <ThemedText style={styles.statValue}>{statistics.totalSteps.toLocaleString()}</ThemedText>
            <ThemedText style={styles.statLabel}>Total Steps</ThemedText>
          </View>

          <View style={styles.statCard}>
            <IconSymbol name="chart.bar" size={24} color="#34C759" />
            <ThemedText style={styles.statValue}>{statistics.avgSteps.toLocaleString()}</ThemedText>
            <ThemedText style={styles.statLabel}>Daily Average</ThemedText>
          </View>

          <View style={styles.statCard}>
            <IconSymbol name="trophy" size={24} color="#FFB800" />
            <ThemedText style={styles.statValue}>{statistics.bestDay.toLocaleString()}</ThemedText>
            <ThemedText style={styles.statLabel}>Best Day</ThemedText>
          </View>

          <View style={styles.statCard}>
            <IconSymbol name="calendar.badge.checkmark" size={24} color="#FF3B82" />
            <ThemedText style={styles.statValue}>{statistics.consistency}%</ThemedText>
            <ThemedText style={styles.statLabel}>Consistency</ThemedText>
          </View>
        </View>

        {/* Chart */}
        <View style={styles.chartContainer}>
          <ThemedText style={styles.sectionTitle}>Weekly Progress</ThemedText>
          {stepHistory.length > 0 ? (
            <LineChart
              data={getChartData()}
              width={screenWidth - 40}
              height={220}
              yAxisLabel=""
              yAxisSuffix=""
              yAxisInterval={1}
              chartConfig={{
                backgroundColor: colorScheme === 'dark' ? '#1a1a1a' : '#ffffff',
                backgroundGradientFrom: colorScheme === 'dark' ? '#1a1a1a' : '#ffffff',
                backgroundGradientTo: colorScheme === 'dark' ? '#1a1a1a' : '#ffffff',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(74, 144, 226, ${opacity})`,
                labelColor: (opacity = 1) => COLORS.gray,
                style: {
                  borderRadius: 16,
                },
                propsForDots: {
                  r: '6',
                  strokeWidth: '2',
                  stroke: '#4A90E2',
                },
              }}
              bezier
              style={styles.chart}
            />
          ) : (
            <View style={styles.noDataContainer}>
              <IconSymbol name="chart.line.uptrend.xyaxis" size={48} color="#ccc" />
              <ThemedText style={styles.noDataText}>No activity data yet</ThemedText>
              <ThemedText style={styles.noDataSubtext}>Start walking to see your progress!</ThemedText>
            </View>
          )}
        </View>

        {/* Recent Sessions */}
        <View style={styles.sessionsContainer}>
          <ThemedText style={styles.sectionTitle}>Recent Sessions</ThemedText>
          {sessions.length > 0 ? (
            sessions.map(renderSession)
          ) : (
            <View style={styles.noSessionsContainer}>
              <IconSymbol name="figure.walk" size={48} color="#ccc" />
              <ThemedText style={styles.noDataText}>No sessions recorded</ThemedText>
              <ThemedText style={styles.noDataSubtext}>Your walking sessions will appear here</ThemedText>
            </View>
          )}
        </View>

        {/* Recovery Insights */}
        <View style={styles.insightsContainer}>
          <ThemedText style={styles.sectionTitle}>Recovery Insights</ThemedText>

          <View style={styles.insightCard}>
            <IconSymbol name="heart.circle" size={24} color="#FF3B82" />
            <View style={styles.insightContent}>
              <ThemedText style={styles.insightTitle}>Progress Trend</ThemedText>
              <ThemedText style={styles.insightText}>
                {statistics.consistency > 70
                  ? "Excellent consistency! You're building great habits for your recovery."
                  : statistics.consistency > 40
                    ? "Good progress! Try to maintain regular activity for better results."
                    : "Focus on consistency. Even short walks daily can make a big difference."
                }
              </ThemedText>
            </View>
          </View>

          <View style={styles.insightCard}>
            <IconSymbol name="lightbulb" size={24} color="#FFB800" />
            <View style={styles.insightContent}>
              <ThemedText style={styles.insightTitle}>Recommendation</ThemedText>
              <ThemedText style={styles.insightText}>
                {statistics.avgSteps < 1000
                  ? "Start with 5-10 minute walks. Gradually increase as you feel stronger."
                  : statistics.avgSteps < 2000
                    ? "Great start! Try adding 200-300 more steps each week."
                    : "Excellent progress! Consider adding balance exercises to your routine."
                }
              </ThemedText>
            </View>
          </View>
        </View>
      </ScrollView>
    );
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F8F9FA',
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
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
    periodSelector: {
      flexDirection: 'row',
      marginHorizontal: 20,
      marginBottom: 20,
      backgroundColor: '#E5E7EB',
      borderRadius: 12,
      padding: 4,
    },
    periodButton: {
      flex: 1,
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 8,
      alignItems: 'center',
    },
    periodButtonText: {
      fontSize: 14,
      fontWeight: '600',
    },
    statsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      paddingHorizontal: 20,
      marginBottom: 20,
      justifyContent: 'space-between',
    },
    statCard: {
      width: '48%',
      padding: 16,
      borderRadius: 12,
      alignItems: 'center',
      marginBottom: 12,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
    },
    statValue: {
      fontSize: 18,
      fontWeight: 'bold',
      marginTop: 8,
    },
    statLabel: {
      fontSize: 12,
      color: '#666',
      marginTop: 4,
      textAlign: 'center',
    },
    chartContainer: {
      marginHorizontal: 20,
      marginBottom: 20,
      padding: 20,
      borderRadius: 16,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 16,
    },
    chart: {
      marginVertical: 8,
      borderRadius: 16,
    },
    noDataContainer: {
      alignItems: 'center',
      paddingVertical: 40,
    },
    noDataText: {
      fontSize: 16,
      fontWeight: '600',
      marginTop: 16,
      color: '#666',
    },
    noDataSubtext: {
      fontSize: 14,
      color: '#999',
      marginTop: 4,
    },
    sessionsContainer: {
      marginHorizontal: 20,
      marginBottom: 20,
      padding: 20,
      borderRadius: 16,
    },
    sessionCard: {
      padding: 16,
      borderRadius: 12,
      backgroundColor: '#FFFFFF',
      marginBottom: 12,
      elevation: 1,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 1,
    },
    sessionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    sessionDate: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    sessionDateText: {
      marginLeft: 8,
      fontSize: 14,
      fontWeight: '600',
    },
    sessionBadge: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
    },
    sessionBadgeText: {
      fontSize: 12,
      color: 'white',
      fontWeight: '600',
    },
    sessionStats: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    sessionStat: {
      alignItems: 'center',
      flex: 1,
    },
    sessionStatValue: {
      fontSize: 16,
      fontWeight: 'bold',
      marginTop: 4,
    },
    sessionStatLabel: {
      fontSize: 10,
      color: '#666',
      marginTop: 2,
    },
    noSessionsContainer: {
      alignItems: 'center',
      paddingVertical: 40,
    },
    insightsContainer: {
      marginHorizontal: 20,
      marginBottom: 30,
      padding: 20,
      borderRadius: 16,
    },
    insightCard: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      paddingVertical: 16,
      paddingHorizontal: 16,
      backgroundColor: '#F0F8FF',
      borderRadius: 12,
      marginBottom: 12,
    },
    insightContent: {
      flex: 1,
      marginLeft: 16,
    },
    insightTitle: {
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 4,
    },
    insightText: {
      fontSize: 14,
      color: '#666',
      lineHeight: 18,
    },
  });
  
  // This should be inside a function that has access to stepHistory
  function calculateStatistics(stepHistory: Array<{step_count: number}>) {
    const totalSteps = stepHistory.reduce((sum, data) => sum + data.step_count, 0);
    const avgSteps = Math.round(stepHistory.length > 0 ? totalSteps / stepHistory.length : 0);
    const bestDay = stepHistory.length > 0 ? Math.max(...stepHistory.map(data => data.step_count)) : 0;
    const daysWithSteps = stepHistory.filter(data => data.step_count > 100).length;
    const consistency = stepHistory.length > 0 ? Math.round((daysWithSteps / stepHistory.length) * 100) : 0;
  
    return { totalSteps, avgSteps, bestDay, consistency };
  }