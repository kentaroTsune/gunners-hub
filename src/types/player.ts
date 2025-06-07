export interface Player {
  id: string;            // 選手ID（FirestoreのドキュメントID）
  name: string;          // 選手名
  position: string;      // ポジション
  jerseyNumber?: number; // 背番号（オプショナル）
  nationality?: string;  // 国籍（オプショナル）
  birthDate?: string;    // 生年月日（ISO形式）
  height?: number;       // 身長(cm)
  weight?: number;       // 体重(kg)
  imageUrl?: string;     // プロフィール画像URL
  bio?: string;          // 選手紹介文
  joinedAt?: string;      // 加入日（ISO形式）
  stats?: {              // 成績データ（オプショナル）
    appearances: number;
    goals: number;
    assists: number;
  };
}

export type Players = Player[];
