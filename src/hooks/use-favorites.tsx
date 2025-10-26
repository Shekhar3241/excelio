import { useState, useEffect } from "react";

const FAVORITES_KEY = "excelio-favorites";

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>(() => {
    const stored = localStorage.getItem(FAVORITES_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (formulaId: string) => {
    setFavorites(prev =>
      prev.includes(formulaId)
        ? prev.filter(id => id !== formulaId)
        : [...prev, formulaId]
    );
  };

  const isFavorite = (formulaId: string) => favorites.includes(formulaId);

  return { favorites, toggleFavorite, isFavorite };
}
