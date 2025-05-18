import { registerServiceWorker, unregisterServiceWorker, storeMessageForSync } from './service-worker';

describe('Service Worker', () => {
  describe('registerServiceWorker', () => {
    const mockRegistration = {
      scope: 'test-scope',
      unregister: jest.fn(),
      installing: null,
      waiting: null,
      active: null,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    } as unknown as ServiceWorkerRegistration;

    beforeEach(() => {
      // Reset all mocks
      jest.resetAllMocks();
      
      // Mock service worker
      Object.defineProperty(window, 'navigator', {
        value: {
          serviceWorker: {
            register: jest.fn().mockResolvedValue(mockRegistration),
            getRegistrations: jest.fn().mockResolvedValue([mockRegistration]),
            addEventListener: jest.fn(),
            removeEventListener: jest.fn(),
            dispatchEvent: jest.fn(),
          } as unknown as ServiceWorkerContainer,
        },
        writable: true,
      });
    });

    it('registers service worker successfully', async () => {
      const registration = await registerServiceWorker();
      expect(registration).toBe(mockRegistration);
      expect(navigator.serviceWorker.register).toHaveBeenCalledWith('/sw.js');
    });

    it('handles unsupported service workers', async () => {
      Object.defineProperty(window, 'navigator', {
        value: {},
        writable: true,
      });

      await expect(registerServiceWorker()).rejects.toThrow('Service workers are not supported');
    });

    it('handles registration failure', async () => {
      const error = new Error('Registration failed');
      (navigator.serviceWorker.register as jest.Mock).mockRejectedValue(error);

      await expect(registerServiceWorker()).rejects.toThrow(error);
    });
  });

  describe('unregisterServiceWorker', () => {
    const mockRegistration = {
      scope: 'test-scope',
      unregister: jest.fn().mockResolvedValue(true),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    } as unknown as ServiceWorkerRegistration;

    beforeEach(() => {
      jest.resetAllMocks();
      Object.defineProperty(window, 'navigator', {
        value: {
          serviceWorker: {
            getRegistrations: jest.fn().mockResolvedValue([mockRegistration]),
            addEventListener: jest.fn(),
            removeEventListener: jest.fn(),
            dispatchEvent: jest.fn(),
          } as unknown as ServiceWorkerContainer,
        },
        writable: true,
      });
    });

    it('unregisters service worker successfully', async () => {
      await unregisterServiceWorker();
      expect(mockRegistration.unregister).toHaveBeenCalled();
    });

    it('handles unregistration failure', async () => {
      const error = new Error('Unregistration failed');
      (mockRegistration.unregister as jest.Mock).mockRejectedValue(error);

      await expect(unregisterServiceWorker()).rejects.toThrow(error);
    });
  });

  let mockDB: IDBDatabase;
  let mockObjectStore: { add: jest.Mock };
  let mockTransaction: {
    objectStore: jest.Mock;
    oncomplete: ((event: Event) => void) | null;
    onerror: ((event: Event) => void) | null;
    error: Error | null;
  };

  beforeEach(() => {
    jest.useFakeTimers({ advanceTimers: true });
    
    mockObjectStore = {
      add: jest.fn()
    };
    
    mockTransaction = {
      objectStore: jest.fn().mockReturnValue(mockObjectStore),
      oncomplete: null,
      onerror: null,
      error: null
    };
    
    mockDB = {
      transaction: jest.fn().mockReturnValue(mockTransaction),
      objectStoreNames: {
        contains: jest.fn().mockReturnValue(true)
      }
    } as unknown as IDBDatabase;

    // Mock indexedDB.open
    const mockIDBRequest = {
      result: mockDB,
      onsuccess: null as ((event: Event) => void) | null,
      onerror: null as ((event: Event) => void) | null,
      onupgradeneeded: null as ((event: IDBVersionChangeEvent) => void) | null
    };

    global.indexedDB = {
      open: jest.fn().mockImplementation(() => {
        Promise.resolve().then(() => {
          if (mockIDBRequest.onsuccess) {
            mockIDBRequest.onsuccess(new Event('success'));
          }
        });
        return mockIDBRequest;
      })
    } as unknown as IDBFactory;
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  describe('storeMessageForSync', () => {
    it('stores message in IndexedDB', async () => {
      const message = { content: 'Test message' };
      const mockRequest = {
        onsuccess: null as ((event: Event) => void) | null
      };

      mockObjectStore.add.mockImplementation(() => {
        setTimeout(() => {
          if (mockRequest.onsuccess) {
            mockRequest.onsuccess(new Event('success'));
          }
          if (mockTransaction.oncomplete) {
            mockTransaction.oncomplete(new Event('complete'));
          }
        }, 0);
        return mockRequest;
      });

      const storePromise = storeMessageForSync(message);
      
      // Run timers and flush promises
      jest.advanceTimersByTime(0);
      await Promise.resolve();

      await storePromise;

      expect(mockObjectStore.add).toHaveBeenCalledWith({
        ...message,
        timestamp: expect.any(Number),
        status: 'pending'
      });
    }, 10000);

    it('handles transaction errors', async () => {
      const error = new Error('Transaction error');
      mockTransaction.error = error;

      mockObjectStore.add.mockImplementation(() => {
        setTimeout(() => {
          if (mockTransaction.onerror) {
            mockTransaction.onerror(new Event('error'));
          }
        }, 0);
        return {};
      });

      const storePromise = storeMessageForSync({ content: 'Test message' });
      
      // Run timers and flush promises
      jest.advanceTimersByTime(0);
      await Promise.resolve();

      await expect(storePromise).rejects.toBe(error);
    }, 10000);
  });
}); 