import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const model = body.model || 'Gemini Flash';
    const messages = body.messages || [];
    const lastUserMessage = [...messages].reverse().find((message: any) => message.role === 'user')?.content || 'Hello';

    const openrouterApiKey = process.env.OPENROUTER_API_KEY;
    const huggingFaceToken = process.env.HF_TOKEN;

    if (model === 'Gemini Flash' && openrouterApiKey) {
      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${openrouterApiKey}`,
          'HTTP-Referer': 'https://example.com',
          'X-Title': 'Nova AI Demo',
        },
        body: JSON.stringify({
          model: 'google/gemini-2.0-flash-001',
          messages: [
            { role: 'system', content: 'You are Nova, a friendly AI assistant.' },
            ...messages.map((message: any) => ({ role: message.role, content: message.content })),
          ],
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const text = data?.choices?.[0]?.message?.content || 'No response.';
        return NextResponse.json({ message: text });
      }
    }

    if (huggingFaceToken) {
      const res = await fetch('https://api-inference.huggingface.co/models/google/gemma-2-2b-it', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${huggingFaceToken}`,
        },
        body: JSON.stringify({ inputs: `You are Nova, a modern AI assistant. Respond helpfully.\n\nUser: ${lastUserMessage}` }),
      });

      if (res.ok) {
        const data = await res.json();
        const text = Array.isArray(data)
          ? data[0]?.generated_text || 'No response.'
          : typeof data === 'string'
            ? data
            : data?.error || 'No response.';
        return NextResponse.json({ message: text.replace(`You are Nova, a modern AI assistant. Respond helpfully.\n\nUser: ${lastUserMessage}`, '').trim() || 'Here is a useful answer.' });
      }
    }

    return NextResponse.json({
      message: getDemoResponse(lastUserMessage),
    });
  } catch {
    return NextResponse.json({
      message: 'I hit a temporary issue. Try again in a moment.',
    });
  }
}

function getDemoResponse(prompt: string) {
  const normalized = prompt.toLowerCase();

  if (normalized.includes('launch') || normalized.includes('startup')) {
    return 'Here is a polished launch message: "We built something powerful for teams that want smarter workflows and more momentum. Think faster decisions, better clarity, and a product experience that makes work feel effortless."';
  }

  if (normalized.includes('code') || normalized.includes('build')) {
    return 'A strong approach is to start with the problem, sketch the user flow, then implement the smallest useful version. Focus on clarity, fast iteration, and one measurable outcome at a time.';
  }

  if (normalized.includes('strategy') || normalized.includes('roadmap')) {
    return 'A great roadmap starts with the customer problem, then organizes priorities by impact, effort, and confidence. Review every quarter and cut anything that isn’t driving measurable progress.';
  }

  return `Here’s a helpful answer to: “${prompt}”. The best way to approach this is to clarify the goal, simplify the constraints, and iterate quickly. If you want, I can turn this into a polished brief, bullet list, outline, or execution plan.`;
}
