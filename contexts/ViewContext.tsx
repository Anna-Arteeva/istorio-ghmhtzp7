import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ViewRecord {
  id: string;
  type: 'story' | 'info_card';
  timestamp: string;
}

interface ViewContextType {
  recordView: (id: string, type: 'story' | 'info_card') => Promise<void>;
  getLastViewTimestamp: (id: string) => string | null;
  viewHistory: ViewRecord[];
}

const ViewContext = createContext<ViewContextType | undefined>(undefined);

const STORAGE_KEY = '@view_history';

export function ViewProvider({ children }: { children: ReactNode }) {
  const [viewHistory, setViewHistory] = useState<ViewRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadViewHistory();
  }, []);

  async function loadViewHistory() {
    try {
      setIsLoading(true);
      const storedHistory = await AsyncStorage.getItem(STORAGE_KEY);
      
      if (storedHistory) {
        const parsedHistory = JSON.parse(storedHistory);
        if (Array.isArray(parsedHistory)) {
          setViewHistory(parsedHistory);
        }
      }
    } catch (error) {
      console.error('Error loading view history:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const recordView = async (id: string, type: 'story' | 'info_card') => {
    try {
      const newRecord: ViewRecord = {
        id,
        type,
        timestamp: new Date().toISOString()
      };

      const updatedHistory = [...viewHistory, newRecord];
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
      setViewHistory(updatedHistory);
    } catch (error) {
      console.error('Error recording view:', error);
    }
  };

  const getLastViewTimestamp = (id: string): string | null => {
    const records = viewHistory.filter(record => record.id === id);
    if (records.length === 0) return null;
    
    // Get the most recent view
    const sortedRecords = records.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    return sortedRecords[0].timestamp;
  };

  if (isLoading) {
    return null;
  }

  return (
    <ViewContext.Provider value={{
      recordView,
      getLastViewTimestamp,
      viewHistory
    }}>
      {children}
    </ViewContext.Provider>
  );
}

export function useViews() {
  const context = useContext(ViewContext);
  if (context === undefined) {
    throw new Error('useViews must be used within a ViewProvider');
  }
  return context;
}