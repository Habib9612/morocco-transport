import { toast } from 'sonner';

// A generic API response structure
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

  // Define a generic request method
  public async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };
    
    if (this.token) {
      (headers as any)['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'An API error occurred');
      }
      
      return response.json();
    } catch (error: any) {
      console.error(`API request to ${endpoint} failed:`, error.message);
      toast.error(error.message);
      throw error;
    }
  }

  // Authentication
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
    me: () => this.request<any>('/auth/me'),
  };

  // Users
  users = {
    getAll: () => this.request<any[]>('/users'),
    getById: (id: string) => this.request<any>(`/users/${id}`),
    update: (id: string, data: any) =>
      this.request<any>(`/users/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    delete: (id: string) => this.request(`/users/${id}`, { method: 'DELETE' }),
  };

  // Shipments
  shipments = {
    getAll: (params?: Record<string, any>) => {
      const queryString = params ? new URLSearchParams(params).toString() : '';
      return this.request<any[]>(`/shipments${queryString ? `?${queryString}` : ''}`);
    },
    getById: (id: string) => this.request<any>(`/shipments/${id}`),
    create: (data: any) =>
      this.request<any>('/shipments', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (id: string, data: any) =>
      this.request<any>(`/shipments/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    delete: (id: string) => this.request(`/shipments/${id}`, { method: 'DELETE' }),
    tracking: (id: string) => this.request<any>(`/shipments/${id}/tracking`),
  };

  // Trucks
  trucks = {
    getAll: (params?: Record<string, any>) => {
      const queryString = params ? new URLSearchParams(params).toString() : '';
      return this.request<any[]>(`/trucks${queryString ? `?${queryString}` : ''}`);
    },
    getById: (id: string) => this.request<any>(`/trucks/${id}`),
    create: (data: any) =>
      this.request<any>('/trucks', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (id: string, data: any) =>
      this.request<any>(`/trucks/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    delete: (id: string) => this.request(`/trucks/${id}`, { method: 'DELETE' }),
  };

  // Analytics
  analytics = {
    dashboard: () => this.request<any>('/analytics/dashboard'),
    shipments: (params?: Record<string, any>) => {
      const queryString = params ? new URLSearchParams(params).toString() : '';
      return this.request<any>(`/analytics/shipments${queryString ? `?${queryString}` : ''}`);
    },
    revenue: (params?: Record<string, any>) => {
      const queryString = params ? new URLSearchParams(params).toString() : '';
      return this.request<any>(`/analytics/revenue${queryString ? `?${queryString}` : ''}`);
    },
  };

  // Notifications
  notifications = {
    getAll: () => this.request<any[]>('/notifications'),
    markAsRead: (id: string) =>
      this.request(`/notifications/${id}`, { method: 'PUT' }),
    markAllAsRead: () =>
      this.request('/notifications/mark-all-read', { method: 'PUT' }),
  };

  // Messages
  messages = {
    getAll: () => this.request<any[]>('/messages'),
    send: (data: any) =>
      this.request<any>('/messages', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  };
}

export const apiClient = new ApiClient();

// Define interfaces for API data structures
interface LoginData {
  email: string;
  password: string;
}

interface SignupData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role?: string;
}

interface ShipmentData {
  // Define shipment properties here based on your model
  origin_id: string;
  destination_id: string;
  // ... other fields
}

// ... other data interfaces

// Strongly type the API endpoints
export const api = {
  auth: {
    login: (data: LoginData) => apiClient.request<any>('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
    signup: (data: SignupData) => apiClient.request<any>('/auth/signup', { method: 'POST', body: JSON.stringify(data) }),
    logout: () => apiClient.request<any>('/auth/logout', { method: 'POST' }),
    getSession: () => apiClient.request<any>('/auth/session'),
  },
  shipments: {
    create: (data: ShipmentData) => apiClient.request<any>('/shipments', { method: 'POST', body: JSON.stringify(data) }),
    getAll: () => apiClient.request<any>('/shipments'),
    getById: (id: string) => apiClient.request<any>(`/shipments/${id}`),
    update: (id: string, data: Partial<ShipmentData>) => apiClient.request<any>(`/shipments/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    delete: (id: string) => apiClient.request<any>(`/shipments/${id}`, { method: 'DELETE' }),
  },
  // ... other API modules with typed data
};
