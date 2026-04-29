'use client';
import { useChat } from '@ai-sdk/react';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

type Recommendation = {
  university_id: string;
  match_score: number;
  match_reason: string;
  highlights: string[];
};

type University = {
  id: string;
  name: string;
  location: string;
  tier: string;
  image_url: string;
  slug: string;
};

export default function AIRecommendation() {
  const { messages, sendMessage, status } = useChat();
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [universities, setUniversities] = useState<Record<string, University>>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Send profile on mount
  useEffect(() => {
    const profile = sessionStorage.getItem('userProfile');
    if (profile) sendMessage({ text: profile });
  }, []);

  // Parse AI response when it arrives
  useEffect(() => {
    const lastAI = messages.findLast(m => m.role === 'assistant');
    if (!lastAI) return;

    const text = lastAI.parts
      ?.filter((p: any) => p.type === 'text')
      .map((p: any) => p.text)
      .join('');

    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) return;
      const parsed = JSON.parse(jsonMatch[0]);
      if (parsed.message) setErrorMessage(parsed.message);
      if (parsed.recommendations?.length) {
        setRecommendations(parsed.recommendations);
        fetchUniversities(parsed.recommendations.map((r: Recommendation) => r.university_id));
      }
    } catch { /* ignore */ }
  }, [messages]);

  // Fetch university details from Supabase
  const fetchUniversities = async (ids: string[]) => {
    const supabase = createClient();
    const { data } = await supabase.from('universities').select('*').in('id', ids);
    if (!data) return;
    const map: Record<string, University> = {};
    data.forEach(u => { map[u.id] = u; });
    setUniversities(map);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-2">Your Best University Matches</h1>
      <p className="text-gray-500 text-sm mb-6">Our AI analyzed your academic profile to find your best fits.</p>

      {status === 'streaming' && (
        <div className="flex items-center gap-2 text-emerald-600 mb-6">
          <div className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
          Analyzing your profile...
        </div>
      )}

      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
          {errorMessage}
        </div>
      )}

      <div className="flex flex-col gap-4">
        {recommendations.map((rec) => {
          const uni = universities[rec.university_id];
          if (!uni) return null;
          return (
            <div key={rec.university_id} className="flex border rounded-2xl overflow-hidden shadow-sm bg-white dark:bg-zinc-900">
              {/* Image */}
              <img src={uni.image_url} alt={uni.name} className="w-48 object-cover" />

              {/* Content */}
              <div className="flex-1 p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-bold">{uni.name}</h2>
                    <p className="text-xs text-emerald-600 font-semibold uppercase tracking-wide mt-1">
                      {uni.tier} · {uni.location}
                    </p>
                    <p className="text-sm text-gray-500 italic mt-2">{'"'}{rec.match_reason}{'"'}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-3xl font-bold">{rec.match_score}%</span>
                    <p className="text-xs text-gray-400">MATCH SCORE</p>
                  </div>
                </div>

                <ul className="mt-4 space-y-1">
                  {rec.highlights.map((h, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                      <span className="text-emerald-500">✓</span> {h}
                    </li>
                  ))}
                </ul>

                <div className="flex gap-2 mt-5">
                  <a href={`/universities/personal-info/response/${uni.slug}`}
                    className="flex-1 text-center py-2.5 bg-zinc-900 text-white rounded-xl text-sm font-medium hover:bg-zinc-700 transition">
                    View Details
                  </a>
                  <button className="w-10 h-10 border rounded-xl flex items-center justify-center text-gray-400 hover:text-gray-700">
                    🔖
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}