// src/types/memory.ts
export type Emotion = 'happy' | 'sad' | 'love' | 'nostalgic' | 'calm' | string;

export type Privacy = 'public' | 'friends' | 'private';

export interface Memory {
  id: string;
  userId: string;
  title?: string;
  text?: string;
  media?: { type: 'image' | 'video'; url: string }[];
  emotion?: Emotion;
  createdAt: string; // ISO string
  // position on sphere/sky in normalized coords (0..1)
  x: number; // 0..1 relative horizontal
  y: number; // 0..1 relative vertical
  brightness?: number; // 0..1 visual scale
  privacy?: Privacy;
  author?: {
    username: string;
    avatar: string;
  };
}
