import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.EXPO_PUBLIC_GEMINI_API_KEY });

export interface NutritionInfo {
  calories: number;
  macros: {
    carbs: number;
    protein: number;
    fats: number;
  };
}

export async function analyzeFood(foodDescription: string): Promise<NutritionInfo> {
  try {
    const prompt = `Analyze the following food item and provide nutritional information.
    Food: ${foodDescription}
    
    Return ONLY a JSON object with the following structure, without any markdown formatting, code blocks, or additional text:
    {
      "calories": number,
      "macros": {
        "carbs": number,
        "protein": number,
        "fats": number
      }
    }`;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });

    if (!response || !response.text) {
      throw new Error('No response from Gemini API');
    }

    // Clean the response text
    let cleanedText = response.text.trim();
    
    // Remove markdown code block if present
    cleanedText = cleanedText.replace(/```json\n?|\n?```/g, '');
    
    // Remove any leading/trailing whitespace
    cleanedText = cleanedText.trim();

    try {
      // Parse the cleaned response
      const nutritionInfo = JSON.parse(cleanedText);
      
      // Validate the response structure
      if (!nutritionInfo.calories || !nutritionInfo.macros || 
          typeof nutritionInfo.macros.carbs !== 'number' ||
          typeof nutritionInfo.macros.protein !== 'number' ||
          typeof nutritionInfo.macros.fats !== 'number') {
        throw new Error('Invalid response structure from Gemini API');
      }

      return nutritionInfo;
    } catch (parseError) {
      console.error('Failed to parse response:', cleanedText);
      throw new Error('Failed to parse nutrition information');
    }
  } catch (error) {
    console.error('Error analyzing food:', error);
    throw error;
  }
} 