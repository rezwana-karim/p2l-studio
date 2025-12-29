
export type ArtisticStyle = 
  | 'Title Maker'
  | 'Bangladeshi Folk Art'
  | 'Rickshaw Sticker'
  | 'Photorealistic'
  | 'Impressionist'
  | 'Surrealist'
  | 'Minimalist'
  | 'Cyberpunk'
  | 'Pixar Style'
  | 'Vintage Photograph'
  | 'GTA'
  | 'GTA 6'
  | 'Hyperrealistic Game'
  | '8-bit Arcade Game'
  | 'Just a Banana'
  | 'Anime Style'
  | 'Hand-painted'
  | 'Old hand-painted cartoon style';

export type AspectRatio = '1:1' | '16:9' | '9:16' | '4:3' | '3:4';

export type ImageQuality = 'Standard' | '2K' | '4K';

export interface GenerationSettings {
  style: ArtisticStyle;
  lighting: number;
  complexity: number;
  aspectRatio: AspectRatio;
  quality: ImageQuality;
  prompt: string;
  sourceImage?: string; // base64
}

export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  settings: GenerationSettings;
  timestamp: number;
}
