import { safetyLevel, safetyReplies } from '../src/data/safety.mjs';

const systemInstruction = "You are Bridge, a warm, calm parenting guide for parents of children aged 4–18 in India. Use age-specific developmental knowledge and explain possible warning signs with care. Return exactly three short, practical strings in parts, corresponding to What might be happening, What to do now, and Next steps. Give general guidance only. Do not diagnose, give medical advice, promise a child is safe, or tell families to wait when breathing is impaired. For immediate danger, serious breathing difficulty, or suspected anaphylaxis, make calling 112 now the priority. For non-emergency mental-health support mention Tele-MANAS 14416 as appropriate. Do not present booking a psychologist as emergency care.";

export async function chatResponse(request, key) {
  if (request.method !== 'POST') return new Response(null, { status: 405, headers: { Allow: 'POST' } });
  if (!key) return Response.json({ mode: 'demo' }, { headers: { 'Cache-Control': 'no-store' } });
  if (request.headers.get('origin') !== new URL(request.url).origin) return new Response(null, { status: 403 });

  let messages;
  try {
    const body = await request.text();
    if (body.length > 19000) return new Response(null, { status: 413 });
    ({ messages } = JSON.parse(body));
  } catch {
    return new Response(null, { status: 400 });
  }
  if (!Array.isArray(messages) || !messages.length || messages.length > 8 || messages.some(entry =>
    !entry || !['user', 'model'].includes(entry.role) || typeof entry.text !== 'string' || !entry.text.trim() || entry.text.length > 2400
  ) || messages.at(-1).role !== 'user') return new Response(null, { status: 400 });

  const level = safetyLevel(messages.at(-1).text, messages.filter(entry => entry.role === 'user').at(-2)?.text);
  if (level) return Response.json({ parts: safetyReplies[level], level });

  try {
    const upstream = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent', {
      method: 'POST',
      signal: AbortSignal.timeout(12000),
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemInstruction }] },
        contents: messages.map(({ role, text }) => ({ role, parts: [{ text }] })),
        generationConfig: {
          temperature: 0.35,
          maxOutputTokens: 640,
          thinkingConfig: { thinkingBudget: 0 },
          responseMimeType: 'application/json',
          responseSchema: {
            type: 'OBJECT', required: ['parts'],
            properties: { parts: { type: 'ARRAY', items: { type: 'STRING' }, minItems: 3, maxItems: 3 } }
          }
        }
      })
    });
    if (!upstream.ok) throw new Error('Gemini unavailable');
    const payload = await upstream.json();
    const { parts } = JSON.parse(payload.candidates[0].content.parts.map(part => part.text ?? '').join(''));
    if (!Array.isArray(parts) || parts.length !== 3 || parts.some(part => typeof part !== 'string' || !part.trim() || part.length > 1000)) throw new Error('Invalid reply');
    return Response.json({ parts }, { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return Response.json({ error: 'Guidance unavailable' }, { status: 502 });
  }
}
