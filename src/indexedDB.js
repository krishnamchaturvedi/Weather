const dbName = 'Weather_Forecast_db';
const storeName = 'Weather_data';

export const initializeDB = () => {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open(dbName, 1);

    request.onerror = (event) => {
      reject('Error opening IndexedDB');
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName, { keyPath: 'id', autoIncrement: true });
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };
  });
};

export const storeWeatherData = async (data) => {
  const db = await initializeDB();
  const transaction = db.transaction([storeName], 'readwrite');
  const store = transaction.objectStore(storeName);

  return new Promise((resolve, reject) => {
    const request = store.add(data);

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = () => {
      reject('Error storing data in IndexedDB');
    };
  });
};

export const getAllWeatherData = async () => {
  const db = await initializeDB();
  const transaction = db.transaction([storeName], 'readonly');
  const store = transaction.objectStore(storeName);

  return new Promise((resolve, reject) => {
    const request = store.getAll();

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject('Error retrieving data from IndexedDB');
    };
  });
};
