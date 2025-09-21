import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://10.107.48.243:8000/api'; // Replace with your actual server IP

class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async getAuthHeaders(): Promise<Record<string, string>> {
    const token = await AsyncStorage.getItem('access_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers = await this.getAuthHeaders();
    
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    return response.json();
  }

  // Auth methods
  async login(credentials: { username: string; password: string }): Promise<{ access: string; refresh: string }> {
    const response = await this.request<{ access: string; refresh: string }>('/token/', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    await AsyncStorage.setItem('access_token', response.access);
    await AsyncStorage.setItem('refresh_token', response.refresh);
    
    
    return response;
  }

  async register(userData: any): Promise<any> {
    return this.request('/register/', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async getCurrentUser(): Promise<any> {
    return this.request('/me/');
  }

  async logout(): Promise<void> {
    await AsyncStorage.removeItem('access_token');
    await AsyncStorage.removeItem('refresh_token');
  }

  // Step data methods
  async uploadStepData(stepData: { device_id: string; timestamp: string; step_count: number }): Promise<any> {
    return this.request('/steps/', {
      method: 'POST',
      body: JSON.stringify(stepData),
    });
  }

  async getStepData(): Promise<any[]> {
    return this.request('/steps/');
  }

  // Device methods
  async getDevices(): Promise<any[]> {
    return this.request('/devices/');
  }

  async createDevice(deviceData: { device_id: string; nickname?: string }): Promise<any> {
    return this.request('/devices/', {
      method: 'POST',
      body: JSON.stringify(deviceData),
    });
  }
}

export const apiService = new ApiService(API_BASE_URL);