import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { validateAuthorKey } from '@/lib/api';

type AuthorContextType = {
  authorKey: string | null;
  setAuthorKey: (key: string) => Promise<boolean>;
  clearAuthorKey: () => void;
  isValidatingKey: boolean;
};

const AuthorContext = createContext<AuthorContextType | undefined>(undefined);

// One week in milliseconds
const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;

export function AuthorProvider({ children }: { children: ReactNode }) {
  const [authorKey, setAuthorKeyState] = useState<string | null>(() => {
    // Initialize from localStorage if available
    if (typeof window !== 'undefined') {
      const storedKey = localStorage.getItem('author_key');
      const storedTimestamp = localStorage.getItem('author_key_timestamp');
      
      // Check if key exists and hasn't expired
      if (storedKey && storedTimestamp) {
        const timestamp = parseInt(storedTimestamp, 10);
        const now = Date.now();
        
        // If key has expired, return null
        if (now - timestamp > ONE_WEEK_MS) {
          localStorage.removeItem('author_key');
          localStorage.removeItem('author_key_timestamp');
          return null;
        }
        
        return storedKey;
      }
      return null;
    }
    return null;
  });
  const [isValidatingKey, setIsValidatingKey] = useState(false);

  // Check for expiration on component mount and periodically
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const checkExpiration = () => {
      const storedTimestamp = localStorage.getItem('author_key_timestamp');
      if (authorKey && storedTimestamp) {
        const timestamp = parseInt(storedTimestamp, 10);
        const now = Date.now();
        
        if (now - timestamp > ONE_WEEK_MS) {
          clearAuthorKey();
        }
      }
    };
    
    // Check on mount
    checkExpiration();
    
    // Check periodically (every hour)
    const interval = setInterval(checkExpiration, 60 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [authorKey]);

  const setAuthorKey = async (key: string): Promise<boolean> => {
    try {
      setIsValidatingKey(true);
      // Validate the key before setting it
      const isValid = await validateAuthorKey(key);
      
      if (isValid) {
        setAuthorKeyState(key);
        localStorage.setItem('author_key', key);
        localStorage.setItem('author_key_timestamp', Date.now().toString());
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error validating author key:', error);
      return false;
    } finally {
      setIsValidatingKey(false);
    }
  };

  const clearAuthorKey = () => {
    setAuthorKeyState(null);
    localStorage.removeItem('author_key');
    localStorage.removeItem('author_key_timestamp');
  };

  return (
    <AuthorContext.Provider value={{ 
      authorKey, 
      setAuthorKey, 
      clearAuthorKey,
      isValidatingKey
    }}>
      {children}
    </AuthorContext.Provider>
  );
}

export function useAuthor() {
  const context = useContext(AuthorContext);
  if (context === undefined) {
    throw new Error('useAuthor must be used within an AuthorProvider');
  }
  return context;
} 