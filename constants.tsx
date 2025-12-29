
import React from 'react';
import { ArtisticStyle, AspectRatio, ImageQuality } from './types';

export const ARTISTIC_STYLES: ArtisticStyle[] = [
  'Hyperrealistic Game',
  'Title Maker',
  'Bangladeshi Folk Art',
  'Rickshaw Sticker',
  'Photorealistic',
  'Impressionist',
  'Surrealist',
  'Minimalist',
  'Cyberpunk',
  'Pixar Style',
  'Vintage Photograph',
  'GTA',
  'GTA 6',
  '8-bit Arcade Game',
  'Just a Banana',
  'Anime Style',
  'Hand-painted',
  'Old hand-painted cartoon style'
];

export const ASPECT_RATIOS: AspectRatio[] = ['1:1', '16:9', '9:16', '4:3', '3:4'];

export const IMAGE_QUALITIES: ImageQuality[] = ['Standard', '2K', '4K'];

export const STYLE_CONFIGS: Record<ArtisticStyle, { prompt: string }> = {
  'Hyperrealistic Game': { prompt: 'high-end video game engine render, unreal engine 5, raytracing, cinematic shadows, 8k resolution' },
  'Title Maker': { prompt: 'bold cinematic movie title design, typography focused, dramatic backdrop, high contrast' },
  'Bangladeshi Folk Art': { prompt: 'traditional Bangladeshi Nakshi Kantha patterns, folk motifs, vibrant local colors, rural heritage aesthetics' },
  'Rickshaw Sticker': { prompt: 'Bangladeshi rickshaw art style, hand-painted motifs, bold primary colors, birds and floral patterns, glossy finish' },
  'Photorealistic': { prompt: 'national geographic photography style, ultra-detailed textures, natural light, professional DSLR lens' },
  'Impressionist': { prompt: 'oil on canvas, visible brushstrokes, Monet style, play of light and atmosphere' },
  'Surrealist': { prompt: 'Salvador Dali inspiration, dream-like landscapes, melting objects, impossible geometry' },
  'Minimalist': { prompt: 'clean lines, negative space, Bauhaus inspired, limited color palette, simple geometry' },
  'Cyberpunk': { prompt: 'neon-drenched streets, rainy night, futuristic technology, blade runner aesthetic, cyan and magenta lighting' },
  'Pixar Style': { prompt: '3D animated feature film look, soft character lighting, vibrant colors, expressive features' },
  'Vintage Photograph': { prompt: '1960s film grain, faded colors, sepia tones, historical document feel, light leaks' },
  'GTA': { prompt: 'Grand Theft Auto V loading screen art, saturated colors, thick black outlines, cell-shaded textures' },
  'GTA 6': { prompt: 'modern Vice City sunset aesthetic, high-fidelity character art, realistic lighting with GTA flair' },
  '8-bit Arcade Game': { prompt: 'pixel art, limited color palette, retro 1980s game aesthetics, sharp squares' },
  'Just a Banana': { prompt: 'surreal banana-themed world, yellow dominance, playful fruit textures' },
  'Anime Style': { prompt: 'modern high-budget anime film look, Studio Ghibli or CoMix Wave Films aesthetic, beautiful backgrounds' },
  'Hand-painted': { prompt: 'acrylic on canvas texture, human touch, slight imperfections, rich impasto' },
  'Old hand-painted cartoon style': { prompt: '1940s rubber hose animation, vintage Disney or Fleischer Studios aesthetic, grainy black and white' }
};
