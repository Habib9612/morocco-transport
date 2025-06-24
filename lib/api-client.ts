import { toast } from 'sonner';

interface RequestOptions extends RequestInit {
  showToast?: boolean;
}

class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public data?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  const data = await response.json();

  if (!response.ok) {
    throw new ApiError(
      response.status,
      data.error || 'Something went wrong',
      data
    );
  }

  return data;
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { showToast = true, ...fetchOptions } = options;

  try {
    const response = await fetch(endpoint, {
      ...fetchOptions,
      headers: {
        'Content-Type': 'application/json',
        ...fetchOptions.headers,
      },
    });

    const data = await handleResponse<T>(response);
    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      if (showToast) {
        toast.error(error.message);
      }
      throw error;
    }

    if (showToast) {
      toast.error('Network error. Please try again.');
    }
    throw new ApiError(500, 'Network error');
  }
}

// API endpoints
export const api = {
  auth: {
    login: (data: { email: string; password: string }) =>
      apiClient('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    signup: (data: Record<string, unknown>) =>
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
    create: (data: Record<string, unknown>) =>
      apiClient('/api/shipments', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    getAll: () => apiClient('/api/shipments'),
    getById: (id: string) => apiClient(`/api/shipments/${id}`),
    update: (id: string, data: Record<string, unknown>) =>
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
    create: (data: Record<string, unknown>) =>
      apiClient('/api/vehicles', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    getAll: () => apiClient('/api/vehicles'),
    getById: (id: string) => apiClient(`/api/vehicles/${id}`),
    update: (id: string, data: Record<string, unknown>) =>
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
    create: (data: Record<string, unknown>) =>
      apiClient('/api/maintenance', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    getAll: () => apiClient('/api/maintenance'),
    getById: (id: string) => apiClient(`/api/maintenance/${id}`),
    update: (id: string, data: Record<string, unknown>) =>
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