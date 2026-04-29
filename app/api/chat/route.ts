// app/api/chat/route.ts
import { groq } from '@ai-sdk/groq';
import { streamText } from 'ai';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: Request) {
  const { messages } = await req.json();

  // Fetch your universities from Supabase
  const supabase = await createClient();
  const { data: universities } = await supabase.from('universities').select('*');

  const result = streamText({
    model: groq('llama-3.3-70b-versatile'),
    system: `
You are a university admission counselor. 
The user will send their academic profile as JSON.

You MUST only recommend universities from this list:
${JSON.stringify(universities)}

STRICT RULES:
- If SAT is below 1000, IELTS below 5.5, or GPA below 2.5 → respond: "Unfortunately, your current scores do not meet the minimum requirements for any university in our system."
- Only recommend universities where the user meets ALL minimum requirements.
- Prefer universities matching the user's preferred country and program.
- If no university matches, explain exactly why (e.g. "No CS programs available in Germany in our system").
- Never recommend universities outside the provided list.
- Always return a valid JSON response in this exact format:

{
  "recommendations": [
    {
      "university_id": "id from the list",
      "match_score": 95,
      "match_reason": "Your SAT score and CS interest align well",
      "highlights": ["Top CS program", "Merit scholarship available"]
    }
  ],
  "message": null
}

If no match:
{
  "recommendations": [],
  "message": "Your GPA of 2.0 does not meet the minimum 2.5 required."
}
    `,
    messages: messages.map((m: any) => ({
      role: m.role,
      content: m.parts?.filter((p: any) => p.type === 'text').map((p: any) => p.text).join('') ?? m.content ?? '',
    })),
  });

  return result.toUIMessageStreamResponse();
}