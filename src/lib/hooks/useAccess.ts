import { useEffect, useState } from 'react';

const ACCESS_KEY = 'coffeeAccess';
const CORRECT_PASSWORD = 'hillsongcoffee';

export function useAccess() {
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user has access on mount
  useEffect(() => {
    try {
      const storedAccess = localStorage.getItem(ACCESS_KEY);
      setHasAccess(storedAccess === 'true');
    } catch (error) {
      console.error('Failed to check access:', error);
      setHasAccess(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const checkPassword = (password: string): boolean => {
    const isCorrect = password === CORRECT_PASSWORD;
    
    if (isCorrect) {
      try {
        localStorage.setItem(ACCESS_KEY, 'true');
        setHasAccess(true);
      } catch (error) {
        console.error('Failed to save access:', error);
      }
    }
    
    return isCorrect;
  };

  const logout = () => {
    try {
      localStorage.removeItem(ACCESS_KEY);
      setHasAccess(false);
    } catch (error) {
      console.error('Failed to remove access:', error);
    }
  };

  return {
    hasAccess,
    isLoading,
    checkPassword,
    logout
  };
} 