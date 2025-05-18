useApi.ts
import { useState, useEffect, useCallback, useRef } from 'react';
import { api } from '../lib/api-client';
import { toast } from 'sonner';

// Define the return type for our hook
interface UseApiResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

// Options for the useApi hook
interface UseApiOptions {
  // If true, the request will not be made automatically on component mount
  manual?: boolean;
  // Custom error handler
  onError?: (error: Error) => void;
  // Whether to show error toast
  showErrorToast?: boolean;
  // Dependencies for refetching (similar to useEffect deps)
  deps?: any[];
}

/**
 * Custom hook for making API requests with loading and error states
 * @param apiMethod - Function that returns a Promise of the API call
 * @param options - Configuration options
 * @returns Object with data, loading state, error, and refetch function
 */
export function useApi<T>(
  apiMethod: () => Promise<T>,
  options: UseApiOptions = {}
): UseApiResult<T> {
  const {
    manual = false,
    onError,
    showErrorToast = true,
    deps = []
  } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(!manual);
  const [error, setError] = useState<Error | null>(null);
  
  // Use refs to avoid stale closures in the fetchData function
  const mounted = useRef(true);
  const apiMethodRef = useRef(apiMethod);
  apiMethodRef.current = apiMethod;

  const fetchData = useCallback(async () => {
    if (!mounted.current) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await apiMethodRef.current();
      
      if (mounted.current) {
        setData(result);
        setLoading(false);
      }
    } catch (err) {
      if (mounted.current) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        setLoading(false);
        
        if (onError) {
          onError(error);
        }
        
        if (showErrorToast) {
          toast.error(error.message || 'An error occurred');
        }
      }
    }
  }, [onError, showErrorToast]);

  // Initial fetch on mount if not manual
  useEffect(() => {
    if (!manual) {
      fetchData();
    }
    
    return () => {
      mounted.current = false;
    };
  }, [fetchData, manual, ...deps]);

  return {
    data,
    loading,
    error,
    refetch: fetchData
  };
}

/**
 * Hook for making GET requests
 */
export function useApiGet<T>(endpoint: string, options?: UseApiOptions): UseApiResult<T> {
  return useApi(() => api.get<T>(endpoint), options);
}

/**
 * Hook for making POST requests
 */
export function useApiPost<T>(
  endpoint: string,
  data: any,
  options?: UseApiOptions
): UseApiResult<T> {
  const dataRef = useRef(data);
  dataRef.current = data;
  
  return useApi(() => api.post<T>(endpoint, dataRef.current), options);
}

/**
 * Hook for making PUT requests
 */
export function useApiPut<T>(
  endpoint: string,
  data: any,
  options?: UseApiOptions
): UseApiResult<T> {
  const dataRef = useRef(data);
  dataRef.current = data;
  
  return useApi(() => api.put<T>(endpoint, dataRef.current), options);
}

/**
 * Hook for making DELETE requests
 */
export function useApiDelete<T>(endpoint: string, options?: UseApiOptions): UseApiResult<T> {
  return useApi(() => api.delete<T>(endpoint), options);
}

export default useApi;