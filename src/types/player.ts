interface PlayerStats {
  appearances: number;
  goals: number;
  assists: number;
}
export interface Player {
  id: string;
  name: string;
  nationality: string;
  position: string;
  stats?: PlayerStats;
  bio?: string;
}

export type Players = Player[];
