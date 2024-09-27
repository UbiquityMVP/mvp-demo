import { useState, useEffect } from 'react';
import { useGameState } from '../../hookstate-store/GameState';

export function useGameInitialization() {
  const gameState = useGameState();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    async function initializeGame() {
      await gameState.startGame();
      setIsInitialized(true);
    }

    if (!isInitialized) {
      initializeGame();
    }

    return () => {
      setIsInitialized(false);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return isInitialized;
}
