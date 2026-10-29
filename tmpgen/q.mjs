import { GoogleGenAI } from '@google/genai';
const ai = new GoogleGenAI({ apiKey: process.env.OHGeminiAPI });
try {
  await ai.models.generateContent({ model:'gemini-3.6-flash', contents:[{role:'user',parts:[{text:'hi'}]}] });
  console.log('QUOTA OK NOW');
} catch (e) {
  console.log('STATUS:', e.status||e.code);
  const s = JSON.stringify(e, null, 1);
  console.log(s.slice(0, 1400));
}
