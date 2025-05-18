export async function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered with scope:', registration.scope);

      // Handle updates
      if (registration.installing) {
        registration.installing.addEventListener('statechange', () => {
          if (registration.waiting && navigator.serviceWorker.controller) {
            // New content is available, show update notification
            if (confirm('New version available! Would you like to update?')) {
              window.location.reload();
            }
          }
        });
      }

      // Handle controller change
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        console.log('New service worker activated');
      });

      return registration;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      throw error;
    }
  }
  throw new Error('Service workers are not supported');
}

export async function unregisterServiceWorker() {
  if ('serviceWorker' in navigator) {
    try {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(registrations.map(registration => registration.unregister()));
      console.log('Service Worker unregistered');
    } catch (error) {
      console.error('Service Worker unregistration failed:', error);
      throw error;
    }
  }
}

// Function to store a message in IndexedDB for offline sync
export async function storeMessageForSync(message: any) {
  if ('indexedDB' in window) {
    const db = await openDB();
    const tx = db.transaction('outbox', 'readwrite');
    const store = tx.objectStore('outbox');
    await store.add({
      ...message,
      timestamp: Date.now(),
      status: 'pending'
    });
    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve(undefined);
      tx.onerror = () => reject(tx.error);
    });
  }
}

// Function to open IndexedDB
async function openDB() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open('MarocTransitDB', 1);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains('outbox')) {
        db.createObjectStore('outbox', { keyPath: 'id', autoIncrement: true });
      }
    };
  });
}