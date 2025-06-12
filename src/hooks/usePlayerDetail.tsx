export interface Player {
  id: string;
  name: string;
  position: string;
  nationality: string;
}

interface UsePlayerDetailResult {
  player: Player | null;
  loading: boolean;
  error: Error | null;
}

export const usePlayerDetail = (id: string): UsePlayerDetailResult => {
  // 実装予定
  return {
    player: null,
    loading: false,
    error: null
  };
}