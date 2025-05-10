import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.EXPO_PUBLIC_GEMINI_API_KEY || '');

export async function analyzeFood(foodDescription: string) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const prompt = `Analyze the following food item and provide nutritional information in JSON format:
    Food: ${foodDescription}
    
    Return only a JSON object with the following structure:
    {
      "calories": number,
      "macros": {
        "carbs": number,
        "protein": number,
        "fats": number
      }
    }`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return JSON.parse(text);
  } catch (error) {
    console.error('Error analyzing food:', error);
    throw error;
  }
} 