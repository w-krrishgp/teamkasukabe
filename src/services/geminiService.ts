/**
 * Google Gemini AI Agricultural Voice Assistant Service
 * Powers natural conversational voice answering in Hindi and English.
 */

import { MandiRateResult } from './voiceMandiService';

export interface VoiceAssistantResponse {
  spokenText: string;
  displayText: string;
  category: 'mandi' | 'agronomy' | 'weather' | 'general';
  isAiGenerated: boolean;
}

export function getGeminiApiKey(): string {
  const envKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (envKey && envKey !== 'your-gemini-ai-key' && envKey.trim().length > 5) {
    return envKey.trim();
  }
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('harvestguard_gemini_api_key');
    if (stored && stored.trim().length > 5) {
      return stored.trim();
    }
  }
  return '';
}

export function saveGeminiApiKey(key: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('harvestguard_gemini_api_key', key.trim());
  }
}

export function isGeminiActive(): boolean {
  return Boolean(getGeminiApiKey());
}

/**
 * Ask Gemini Voice Assistant in Hindi or English
 */
export async function askGeminiVoiceAssistant(
  query: string,
  language: 'en' | 'hi' = 'hi',
  matchedMandiRate?: MandiRateResult | null
): Promise<VoiceAssistantResponse> {
  const apiKey = getGeminiApiKey();

  // Baseline verified fallback if key is not configured or offline
  const fallbackSpoken = matchedMandiRate
    ? language === 'hi'
      ? matchedMandiRate.spokenResponseHi
      : matchedMandiRate.spokenResponseEn
    : language === 'hi'
    ? 'ऊँझा और मेहसाणा मंडी में गेहूं ₹2,480 और सरसों ₹5,650 प्रति क्विंटल चल रहा है। फसल में सिंचाई या खाद की सलाह के लिए भी पूछ सकते हैं।'
    : 'In Unjha and Mehsana, Wheat is ₹2,480/Qtl and Mustard is ₹5,650/Qtl. You can also ask about fertilizer schedules or crop health.';

  const fallbackDisplay = matchedMandiRate
    ? language === 'hi'
      ? `${matchedMandiRate.cropNameHi}: ₹${matchedMandiRate.modalRate}/क्विंटल (${matchedMandiRate.mandi}, ${matchedMandiRate.district})`
      : `${matchedMandiRate.cropNameEn}: ₹${matchedMandiRate.modalRate}/Qtl (${matchedMandiRate.mandi}, ${matchedMandiRate.district})`
    : fallbackSpoken;

  if (!apiKey) {
    return {
      spokenText: fallbackSpoken,
      displayText: fallbackDisplay,
      category: matchedMandiRate ? 'mandi' : 'general',
      isAiGenerated: false,
    };
  }

  const prompt = `You are HarvestGuard Voice Assistant, an expert AI agronomist and mandi intelligence advisor speaking directly with Indian farmers.
The farmer asked: "${query}".
Language preference: ${language === 'hi' ? 'Hindi (हिन्दी)' : 'Indian English'}.
${
  matchedMandiRate
    ? `Reference Mandi Data for this crop: ${matchedMandiRate.cropNameEn} (${matchedMandiRate.cropNameHi}) at ${matchedMandiRate.mandi}, ${matchedMandiRate.district}. Modal Rate: ₹${matchedMandiRate.modalRate}/Qtl, Min: ₹${matchedMandiRate.minRate}, Max: ₹${matchedMandiRate.maxRate}, Trend: ${matchedMandiRate.change}.`
    : 'No specific mandi crop explicitly matched; treat as a general farming/weather/crop query.'
}

Respond ONLY with valid JSON with this exact schema:
{
  "spokenText": "1-2 brief, natural sentences in ${language === 'hi' ? 'Hindi' : 'English'} to be spoken aloud via Text-To-Speech. It must be polite, direct, and actionable for a farmer.",
  "displayText": "Clear, informative 2-3 sentence answer to display on the screen.",
  "category": "mandi or agronomy or weather or general"
}`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: 'application/json',
            temperature: 0.3,
            maxOutputTokens: 350,
          },
        }),
      }
    );

    if (!response.ok) {
      // Fallback to gemini-1.5-flash
      const fallbackRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              responseMimeType: 'application/json',
              temperature: 0.3,
              maxOutputTokens: 350,
            },
          }),
        }
      );

      if (!fallbackRes.ok) {
        throw new Error(`Gemini Voice Error: ${fallbackRes.status}`);
      }

      const fbData = await fallbackRes.json();
      const rawText = fbData.candidates?.[0]?.content?.parts?.[0]?.text;
      if (rawText) {
        const parsed = JSON.parse(rawText);
        return {
          spokenText: parsed.spokenText || fallbackSpoken,
          displayText: parsed.displayText || fallbackDisplay,
          category: parsed.category || 'general',
          isAiGenerated: true,
        };
      }
    }

    const data = await response.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (rawText) {
      const parsed = JSON.parse(rawText);
      return {
        spokenText: parsed.spokenText || fallbackSpoken,
        displayText: parsed.displayText || fallbackDisplay,
        category: parsed.category || 'general',
        isAiGenerated: true,
      };
    }
  } catch (err) {
    console.error('Gemini Voice Assistant error:', err);
  }

  return {
    spokenText: fallbackSpoken,
    displayText: fallbackDisplay,
    category: matchedMandiRate ? 'mandi' : 'general',
    isAiGenerated: false,
  };
}
