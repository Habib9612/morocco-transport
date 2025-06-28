import { toast } from 'sonner';

interface ApiResponse<T> {
  data: T;
  message?: string;
  success?: boolean;
}

export class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '/api';
  }

  setAuthToken(token: string) {
    this.token = token;
  }

  public async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    let headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };
    // Only set Authorization if headers is a plain object
    if (this.token && typeof headers === 'object' && !Array.isArray(headers)) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, { ...options, headers });
      if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      return await response.json();
    } catch (error) {
      toast.error('API request failed');
      throw error;
    }
  }

  auth = {
    login: (credentials: { email: string; password: string }) =>
      this.request<{ user: any; token: string }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      }),
    signup: (userData: any) =>
      this.request<{ user: any; token: string }>('/auth/signup', {
        method: 'POST',
        body: JSON.stringify(userData),
      }),
    logout: () => this.request('/auth/logout', { method: 'POST' }),
  };

  users = {
    getProfile: () => this.request<any>('/users/profile'),
    updateProfile: (data: any) =>
      this.request<any>('/users/profile', {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
  };

  shipments = {
    getAll: (params?: Record<string, string | number>) =>
      this.request<any>(`/shipments?${params ? new URLSearchParams(params as any) : ''}`),
    create: (shipmentData: any) =>
      this.request<any>('/shipments', {
        method: 'POST',
        body: JSON.stringify(shipmentData),
      }),
    getById: (id: string) => this.request<any>(`/shipments/${id}`),
  };
}

export const apiClient = new ApiClient();