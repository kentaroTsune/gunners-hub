interface PlayerStats {
  appearances: number;
  goals: number;
  assists: number;
}
export interface Player {
  id: string;
  name: string;
  position: string;
  nationality: string;
  image?: string;
  stats?: PlayerStats;
  bio?: string;
}

export type Players = Player[];
