
import { GoogleGenAI } from "@google/genai";
import { GenerationSettings, ArtisticStyle } from "../types";
import { STYLE_CONFIGS } from "../constants";

export const generateImage = async (settings: GenerationSettings): Promise<string> => {
  const isHighQuality = settings.quality === '2K' || settings.quality === '4K';
  
  // Mandatory API key selection for high quality models (Gemini 3 series)
  if (isHighQuality && typeof window !== 'undefined' && window.aistudio) {
    const hasKey = await window.aistudio.hasSelectedApiKey();
    if (!hasKey) {
      await window.aistudio.openSelectKey();
      // Proceed after triggering key selection as per guidelines to avoid race condition
    }
  }

  // Initialize GenAI right before the call to ensure up-to-date API key from potential user dialog
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const modelName = isHighQuality ? 'gemini-3-pro-image-preview' : 'gemini-2.5-flash-image';
  
  const stylePrompt = STYLE_CONFIGS[settings.style].prompt;
  
  const finalPrompt = `
    Create an image in ${settings.style} style.
    Visual tone: cinematic lighting level ${settings.lighting}/10, detail complexity ${settings.complexity}/10.
    Style characteristics: ${stylePrompt}.
    Aspect ratio: ${settings.aspectRatio}.
    Image quality: ${settings.quality}.

    Scene description: ${settings.prompt}.

    Apply realistic depth, accurate anatomy, coherent composition, style-consistent color grading, and professional visual polish.
    Avoid artifacts, distortions, and unnatural textures. 
    Memory over marketing.
  `.trim();

  const parts: any[] = [{ text: finalPrompt }];

  if (settings.sourceImage) {
    // Adding source image for editing or inspiration (multi-part content)
    parts.unshift({
      inlineData: {
        data: settings.sourceImage.split(',')[1],
        mimeType: 'image/png',
      },
    });
  }

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: { parts },
      config: {
        imageConfig: {
          aspectRatio: settings.aspectRatio as any,
          // imageSize is only supported for gemini-3-pro-image-preview
          ...(isHighQuality ? { imageSize: settings.quality as any } : {})
        }
      }
    });

    let imageUrl = '';
    // Safely iterate through candidates and parts to find the generated image
    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          imageUrl = `data:image/png;base64,${part.inlineData.data}`;
          break;
        }
      }
    }

    if (!imageUrl) {
      throw new Error("No image data returned from Gemini. Please try a different prompt or style.");
    }

    return imageUrl;
  } catch (error: any) {
    // Handle unauthorized key errors by prompting for key selection again
    if (error.message?.includes("Requested entity was not found") && isHighQuality && window.aistudio) {
      await window.aistudio.openSelectKey();
    }
    throw error;
  }
};
