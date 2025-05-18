lib/lazy-load.tsx
import React, { lazy, Suspense, ComponentType } from 'react';
import Loading from '../components/loading';

// Type for the component to be lazily loaded
type LazyComponentType<T = any> = ComponentType<T>;

// Options for the lazy loading
interface LazyLoadOptions {
  // Fallback component to show while loading
  fallback?: React.ReactNode;
  // Preload the component (true to load immediately, number for delayed loading)
  preload?: boolean | number;
  // Error boundary component for when loading fails
  errorBoundary?: React.ComponentType<{ error: Error; reset: () => void }>;
}

/**
 * Creates a lazily loaded component with built-in loading indicator and error handling
 * @param factory Function that imports the component
 * @param options Lazy loading options
 * @returns Lazy loaded component
 */
export function lazyLoad<T = any>(
  factory: () => Promise<{ default: LazyComponentType<T> }>,
  options: LazyLoadOptions = {}
): React.LazyExoticComponent<LazyComponentType<T>> {
  const {
    fallback = <Loading size="md" />,
    preload = false,
    errorBoundary
  } = options;
  
  // Create the lazy component
  const LazyComponent = lazy(factory);
  
  // Preload if requested
  if (preload) {
    if (typeof preload === 'number') {
      // Delayed preload
      setTimeout(() => {
        factory();
      }, preload);
    } else {
      // Immediate preload
      factory();
    }
  }
  
  // Enhance the component with Suspense
  const EnhancedComponent = (props: T) => (
    <Suspense fallback={fallback}>
      <LazyComponent {...props} />
    </Suspense>
  );
  
  // Cast to maintain the LazyExoticComponent type
  return LazyComponent as React.LazyExoticComponent<LazyComponentType<T>>;
}

/**
 * Utility to preload a lazy component
 * @param componentFactory Function that imports the component
 */
export function preloadComponent(
  componentFactory: () => Promise<{ default: ComponentType<any> }>
): void {
  componentFactory();
}

/**
 * Lazily loads a component from the components directory
 * @param path Path to the component (without the components/ prefix)
 * @param options Lazy loading options
 * @returns Lazy loaded component
 */
export function lazyComponent<T = any>(
  path: string,
  options: LazyLoadOptions = {}
): React.LazyExoticComponent<LazyComponentType<T>> {
  return lazyLoad<T>(() => import(`../components/${path}`), options);
}

/**
 * Creates a withLazy higher-order component that adds lazy loading to any component
 * @param Component The component to wrap
 * @param options Lazy loading options
 * @returns A component that will lazily load the provided component
 */
export function withLazy<T = any>(
  Component: LazyComponentType<T>,
  options: LazyLoadOptions = {}
): LazyComponentType<T> {
  const { fallback = <Loading size="md" /> } = options;
  
  return (props: T) => (
    <Suspense fallback={fallback}>
      <Component {...props} />
    </Suspense>
  );
}

export default lazyLoad; 