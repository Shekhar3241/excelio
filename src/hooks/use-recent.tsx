import { useState, useEffect } from "react";

const RECENT_KEY = "excelio-recent";
const MAX_RECENT = 10;

export function useRecent() {
  const [recent, setRecent] = useState<string[]>(() => {
    const stored = localStorage.getItem(RECENT_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem(RECENT_KEY, JSON.stringify(recent));
  }, [recent]);

  const addRecent = (formulaId: string) => {
    setRecent(prev => {
      const filtered = prev.filter(id => id !== formulaId);
      return [formulaId, ...filtered].slice(0, MAX_RECENT);
    });
  };

  return { recent, addRecent };
}
