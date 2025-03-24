import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface VisitContextType {
  firstVisit: string | null;
  visits: string[];
  activeDays: number;
}

const VisitContext = createContext<VisitContextType | undefined>(undefined);

const STORAGE_KEYS = {
  FIRST_VISIT: '@first_visit',
  VISITS: '@visits'
};

export function VisitProvider({ children }: { children: ReactNode }) {
  const [firstVisit, setFirstVisit] = useState<string | null>(null);
  const [visits, setVisits] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadVisitData();
  }, []);

  async function loadVisitData() {
    try {
      setIsLoading(true);
      const [storedFirstVisit, storedVisits] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.FIRST_VISIT),
        AsyncStorage.getItem(STORAGE_KEYS.VISITS),
      ]);

      // Handle first visit
      if (!storedFirstVisit) {
        const now = new Date().toISOString();
        await AsyncStorage.setItem(STORAGE_KEYS.FIRST_VISIT, now);
        setFirstVisit(now);
      } else {
        setFirstVisit(storedFirstVisit);
      }

      // Handle visits
      const today = new Date().toISOString().split('T')[0];
      let visitsArray: string[] = [];
      
      // Safely parse stored visits
      try {
        if (storedVisits) {
          visitsArray = JSON.parse(storedVisits);
          // Ensure it's an array
          if (!Array.isArray(visitsArray)) {
            visitsArray = [];
          }
        }
      } catch (parseError) {
        console.error('Error parsing visits:', parseError);
        visitsArray = [];
      }

      // Add today's visit if it's not already recorded
      if (!visitsArray.includes(today)) {
        visitsArray.push(today);
        // Ensure proper JSON stringification
        await AsyncStorage.setItem(STORAGE_KEYS.VISITS, JSON.stringify(visitsArray));
      }

      setVisits(visitsArray);
    } catch (error) {
      console.error('Error loading visit data:', error);
      // Reset to safe defaults on error
      setVisits([]);
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return null;
  }

  return (
    <VisitContext.Provider
      value={{
        firstVisit,
        visits,
        activeDays: visits.length,
      }}>
      {children}
    </VisitContext.Provider>
  );
}

export function useVisits() {
  const context = useContext(VisitContext);
  if (context === undefined) {
    throw new Error('useVisits must be used within a VisitProvider');
  }
  return context;
}