import { useState } from "react";

export const useFavorite = () => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const toggleFavorite = () => {
    if (!isFavorite) {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 300);
    }
    setIsFavorite(!isFavorite);
  };

  return { isFavorite, toggleFavorite, isAnimating };
};
