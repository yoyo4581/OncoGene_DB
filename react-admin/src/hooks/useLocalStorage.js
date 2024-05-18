import { useState, useEffect } from 'react';

export function useLocalStorage(key, initialValue) {
    const [state, setState] = useState(() => {
      const storedValue = window.localStorage.getItem(key);
      try {
        return storedValue !== null ? JSON.parse(storedValue) : initialValue;
      } catch (error) {
        console.error(`Error parsing storage for key "${key}". Using initial value instead.`, error);
        return initialValue;
      }
    });
  
    useEffect(() => {
      window.localStorage.setItem(key, JSON.stringify(state));
    }, [key, state]);
  
    return [state, setState];
}
  
