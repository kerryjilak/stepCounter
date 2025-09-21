export interface User {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    role: 'patient' | 'staff';
  }
  
  export interface Device {
    id: number;
    device_id: string;
    nickname?: string;
    user: number;
  }
  
  export interface StepData {
    id: number;
    device: number;
    timestamp: string;
    step_count: number;
  }
  
  export interface Profile {
    role: 'patient' | 'staff';
    age?: number;
    condition?: string;
  }
  
  export interface RegisterRequest {
    username: string;
    password: string;
    role: 'patient' | 'staff';
    age?: number;
    condition?: string;
  }
  
  export interface LoginRequest {
    username: string;
    password: string;
  }
  
  export interface AuthResponse {
    access: string;
    refresh: string;
  }