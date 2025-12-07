import { GoogleGenAI, Chat } from "@google/genai";
import { getProducts } from './dataService';

export const createBeautyAdvisorChat = (): Chat => {
  // Always create a new instance to ensure we use the latest API key if it was selected/updated
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Fetch dynamic products from our local DB
  const currentProducts = getProducts();
  
  // Format products for the AI prompt
  const productsContext = currentProducts.map(p => 
    `- ${p.name} (${p.category}): ${p.price} درهم. ${p.description}`
  ).join('\n');

  return ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: `
        أنت مستشار تجميل خبير ومتخصص في منتجات زيت الأرغان المغربي من متجر "أرغانيا".
        دورك هو مساعدة العملاء في اختيار المنتجات المناسبة لنوع بشرتهم وشعرهم.
        
        قائمة المنتجات المتوفرة حالياً في المتجر (الأسعار بالدرهم المغربي):
        ${productsContext}

        قواعدك:
        - تحدث باللغة العربية بأسلوب لبق، دافئ، ومحترف.
        - قدم إجابات قصيرة ومفيدة (لا تتجاوز 50 كلمة إلا إذا سئلت عن التفاصيل).
        - اقترح المنتجات من القائمة أعلاه فقط.
        - إذا سألك العميل عن شيء خارج نطاق التجميل وزيت الأرغان، اعتذر بلطف ووجهه للحديث عن المنتجات.
        - استخدم ايموجي بشكل خفيف 🌿✨.
      `,
    },
  });
};

export const generateArganImage = async (prompt: string, size: '1K' | '2K' | '4K'): Promise<string | null> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [{ text: prompt }]
      },
      config: {
        imageConfig: {
          imageSize: size,
          aspectRatio: '1:1'
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Error generating image:", error);
    throw error;
  }
};