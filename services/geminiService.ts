
import { GoogleGenAI } from "@google/genai";

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const generateVideo = async (userPrompt: string, onProgress: (message: string) => void): Promise<string> => {
  const fullPrompt = `Create a cinematic, 8-second video clip based on the following description: '${userPrompt}'. The style should be photorealistic with dramatic lighting. The video must have high-quality audio that matches the scene.`;

  onProgress("Submitting prompt to the model...");
  let operation = await ai.models.generateVideos({
    model: 'veo-2.0-generate-001',
    prompt: fullPrompt,
    config: {
      numberOfVideos: 1,
    }
  });

  const progressMessages = [
    "AI is dreaming up your video...",
    "Rendering initial frames...",
    "This can take a few minutes, please wait...",
    "Compositing scenes and audio...",
    "Almost there, applying final touches..."
  ];
  let messageIndex = 0;

  onProgress(progressMessages[messageIndex++]);

  while (!operation.done) {
    await delay(10000); // Poll every 10 seconds
    if (messageIndex < progressMessages.length) {
       onProgress(progressMessages[messageIndex++]);
    } else {
       onProgress("Still working... a masterpiece takes time.");
    }
    operation = await ai.operations.getVideosOperation({ operation: operation });
  }

  if (operation.error) {
    throw new Error(`Video generation failed: ${operation.error.message}`);
  }

  const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;

  if (!downloadLink) {
    throw new Error("Video generation completed, but no download link was found.");
  }

  onProgress("Downloading generated video...");

  // The download link requires the API key to be appended
  const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
  if (!response.ok) {
    throw new Error(`Failed to download video file. Status: ${response.status}`);
  }

  const videoBlob = await response.blob();
  const videoUrl = URL.createObjectURL(videoBlob);
  
  onProgress("Video generation complete!");

  return videoUrl;
};
