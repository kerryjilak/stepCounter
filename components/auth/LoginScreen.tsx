import { IconSymbol } from '@/components/ui/IconSymbol';
import { apiService } from '@/services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { ThemedText } from '../ThemedText';

interface LoginScreenProps {
  onSwitchToRegister: () => void;
  onLoginSuccess: () => void; // Add this prop
}

export function LoginScreen({ onSwitchToRegister, onLoginSuccess }: LoginScreenProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert('Error', 'Please enter both username and password.');
      return;
    }

    setIsLoading(true);
    try {
      // Direct API call for login
      await apiService.login({ username: username.trim(), password });
      
      // If login is successful, fetch user data
      const userData = await apiService.getCurrentUser();
      
      // Store user data in AsyncStorage if needed
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      
      // Call the success callback
      onLoginSuccess();
    } catch (error: any) {
      Alert.alert('Login Failed', error.message || 'Please check your credentials and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <LinearGradient
        colors={['#4A90E2', '#7B68EE']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <IconSymbol name="figure.walk" size={48} color="white" />
            </View>
            <ThemedText style={styles.title}>Step Recovery</ThemedText>
            <ThemedText style={styles.subtitle}>
              Your journey to better mobility starts here
            </ThemedText>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <IconSymbol name="person" size={20} color="#666" />
              <TextInput
                style={styles.textInput}
                placeholder="Username"
                placeholderTextColor="#999"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputContainer}>
              <IconSymbol name="gear" size={20} color="#666" />
              <TextInput
                style={styles.textInput}
                placeholder="Password"
                placeholderTextColor="#999"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <TouchableOpacity
              style={[styles.loginButton, isLoading && styles.disabledButton]}
              onPress={handleLogin}
              disabled={isLoading}
            >
              <ThemedText style={styles.loginButtonText}>
                {isLoading ? 'Signing In...' : 'Sign In'}
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity style={styles.registerLink} onPress={onSwitchToRegister}>
              <ThemedText style={styles.registerLinkText}>
                Don't have an account?{' '}
                <ThemedText style={styles.registerLinkTextBold}>Sign Up</ThemedText>
              </ThemedText>
            </TouchableOpacity>
          </View>

          {/* Info */}
          <View style={styles.info}>
            <ThemedText style={styles.infoText}>
              Designed specifically for stroke recovery and post-surgery rehabilitation
            </ThemedText>
          </View>
        </View>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

// components/auth/RegisterScreen.tsx
interface RegisterScreenProps {
  onSwitchToLogin: () => void;
}

export function RegisterScreen({ onSwitchToLogin }: RegisterScreenProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'patient' | 'staff'>('patient');
  const [age, setAge] = useState('');
  const [condition, setCondition] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert('Error', 'Please enter username and password.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }

    if (role === 'patient' && !age.trim()) {
      Alert.alert('Error', 'Please enter your age.');
      return;
    }

    setIsLoading(true);
    try {
      // Direct API call for registration
      await apiService.register({
        username: username.trim(),
        password,
        role,
        ...(role === 'patient' && {
          age: parseInt(age),
          condition: condition.trim() || undefined
        })
      });

      // After successful registration, you might want to automatically log the user in
      // or redirect them to the login screen
      Alert.alert(
        'Registration Successful',
        'Your account has been created. Please log in.',
        [{ text: 'OK', onPress: onSwitchToLogin }]
      );
    } catch (error: any) {
      Alert.alert('Registration Failed', error.message || 'Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <LinearGradient
        colors={['#34C759', '#4A90E2']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <IconSymbol name="heart.circle" size={48} color="white" />
            </View>
            <ThemedText style={styles.title}>Join Recovery</ThemedText>
            <ThemedText style={styles.subtitle}>
              Create your account to start tracking progress
            </ThemedText>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <IconSymbol name="person" size={20} color="#666" />
              <TextInput
                style={styles.textInput}
                placeholder="Username"
                placeholderTextColor="#999"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputContainer}>
              <IconSymbol name="gear" size={20} color="#666" />
              <TextInput
                style={styles.textInput}
                placeholder="Password"
                placeholderTextColor="#999"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            {/* Role Selection */}
            <View style={styles.roleContainer}>
              <ThemedText style={styles.roleLabel}>I am a:</ThemedText>
              <View style={styles.roleButtons}>
                <TouchableOpacity
                  style={[
                    styles.roleButton,
                    role === 'patient' && styles.roleButtonActive,
                  ]}
                  onPress={() => setRole('patient')}
                >
                  <ThemedText
                    style={[
                      styles.roleButtonText,
                      role === 'patient' && styles.roleButtonTextActive,
                    ]}
                  >
                    Patient
                  </ThemedText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.roleButton,
                    role === 'staff' && styles.roleButtonActive,
                  ]}
                  onPress={() => setRole('staff')}
                >
                  <ThemedText
                    style={[
                      styles.roleButtonText,
                      role === 'staff' && styles.roleButtonTextActive,
                    ]}
                  >
                    Healthcare Staff
                  </ThemedText>
                </TouchableOpacity>
              </View>
            </View>

            {role === 'patient' && (
              <>
                <View style={styles.inputContainer}>
                  <IconSymbol name="calendar" size={20} color="#666" />
                  <TextInput
                    style={styles.textInput}
                    placeholder="Age"
                    placeholderTextColor="#999"
                    value={age}
                    onChangeText={setAge}
                    keyboardType="numeric"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <IconSymbol name="heart.text.square" size={20} color="#666" />
                  <TextInput
                    style={styles.textInput}
                    placeholder="Condition (optional)"
                    placeholderTextColor="#999"
                    value={condition}
                    onChangeText={setCondition}
                    multiline
                  />
                </View>
              </>
            )}

            <TouchableOpacity
              style={[styles.loginButton, isLoading && styles.disabledButton]}
              onPress={handleRegister}
              disabled={isLoading}
            >
              <ThemedText style={styles.loginButtonText}>
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity style={styles.registerLink} onPress={onSwitchToLogin}>
              <ThemedText style={styles.registerLinkText}>
                Already have an account?{' '}
                <ThemedText style={styles.registerLinkTextBold}>Sign In</ThemedText>
              </ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

// components/auth/AuthScreen.tsx
export function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);

  return isLogin ? (
    <LoginScreen onSwitchToRegister={() => setIsLogin(false)} onLoginSuccess={() => setIsLogin(true)} />
  ) : (
    <RegisterScreen onSwitchToLogin={() => setIsLogin(true)} />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 22,
  },
  form: {
    marginBottom: 40,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 4,
    marginBottom: 16,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 12,
    paddingLeft: 12,
    color: '#333',
  },
  roleContainer: {
    marginBottom: 16,
  },
  roleLabel: {
    fontSize: 16,
    color: 'white',
    marginBottom: 12,
    fontWeight: '500',
  },
  roleButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  roleButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
  },
  roleButtonActive: {
    backgroundColor: 'white',
  },
  roleButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: 'white',
  },
  roleButtonTextActive: {
    color: '#4A90E2',
  },
  loginButton: {
    backgroundColor: 'white',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  disabledButton: {
    opacity: 0.7,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4A90E2',
  },
  registerLink: {
    alignItems: 'center',
    marginTop: 20,
  },
  registerLinkText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  registerLinkTextBold: {
    fontWeight: 'bold',
    color: 'white',
  },
  info: {
    alignItems: 'center',
  },
  infoText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    lineHeight: 18,
  },
});