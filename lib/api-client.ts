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
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };
    
    if (this.token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, { ...options, headers });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      toast.error('API request failed');
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

<<<<<<< HEAD
// API endpoints
export const api = {
  auth: {
    login: (data: { email: string; password: string }) =>
      apiClient('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    signup: (data: any) =>
      apiClient('/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    logout: () =>
      apiClient('/api/auth/logout', {
        method: 'POST',
      }),
    getSession: () => apiClient('/api/auth/session'),
  },
  shipments: {
    create: (data: any) =>
      apiClient('/api/shipments', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    getAll: () => apiClient('/api/shipments'),
    getById: (id: string) => apiClient(`/api/shipments/${id}`),
    update: (id: string, data: any) =>
      apiClient(`/api/shipments/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      apiClient(`/api/shipments/${id}`, {
        method: 'DELETE',
      }),
  },
  vehicles: {
    create: (data: any) =>
      apiClient('/api/vehicles', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    getAll: () => apiClient('/api/vehicles'),
    getById: (id: string) => apiClient(`/api/vehicles/${id}`),
    update: (id: string, data: any) =>
      apiClient(`/api/vehicles/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      apiClient(`/api/vehicles/${id}`, {
        method: 'DELETE',
      }),
  },
  maintenance: {
    create: (data: any) =>
      apiClient('/api/maintenance', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    getAll: () => apiClient('/api/maintenance'),
    getById: (id: string) => apiClient(`/api/maintenance/${id}`),
    update: (id: string, data: any) =>
      apiClient(`/api/maintenance/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
  },
  notifications: {
    getAll: () => apiClient('/api/notifications'),
    markAsRead: (id: string) =>
      apiClient(`/api/notifications/${id}/read`, {
        method: 'POST',
      }),
    markAllAsRead: () =>
      apiClient('/api/notifications/read-all', {
        method: 'POST',
      }),
  },
};
=======
export const apiClient = new ApiClient();
>>>>>>> 94ceef641d456dbf9d1363a1707df2939762d46d
