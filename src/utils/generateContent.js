import { contentLibrary } from '../data/contentLibrary.js'

/**
 * Returns a random item from the curated content library for the given post type.
 * Optionally excludes a specific item (by text) to avoid repeats.
 */
export function getRandomContent(postType, excludeText = null) {
  const pool = contentLibrary[postType]
  if (!pool || pool.length === 0) return null

  const available = excludeText
    ? pool.filter((item) => item.text !== excludeText)
    : pool

  const candidates = available.length > 0 ? available : pool
  return candidates[Math.floor(Math.random() * candidates.length)]
}

/**
 * Uses the Anthropic API (claude-opus-4-6) to generate fresh content.
 * Requires an API key. Falls back gracefully if the call fails.
 */
export async function generateWithAI(postType, apiKey) {
  const systemPrompt = `You create warm, evidence-based Instagram post content for Birds of a Feather Family Support Services — an organization that helps families navigate a loved one's addiction. The tone is compassionate, hopeful, non-judgmental, and deeply human. Website: birdsofafeatherfamily.com.

Always write in second or third person (never first person). Keep content under 90 words. Do NOT include any preamble, explanation, or quotes around your answer — just the content itself.`

  const userPrompts = {
    quote: `Generate one original, meaningful quote about family healing and addiction recovery. Include an optional short attribution (real person or "— Anonymous"). Format: quote text on one line, then attribution on the next line starting with "—". If no attribution, just write the quote.`,

    tip: `Generate one warm, practical tip for family members who are supporting a loved one through addiction. Be specific and actionable. Just the tip — no title or label needed.`,

    story: `Write one brief 2–3 sentence story or vignette about a family's journey with addiction and recovery. Be hopeful and specific. Write it in third person. Just the story — no title needed.`,

    inspirational: `Write one original, uplifting inspirational message for families dealing with a loved one's addiction. Be warm, specific to the family experience, and end with a sense of hope. Just the message — no title needed.`,
  }

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-opus-4-6',
      max_tokens: 250,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompts[postType] }],
    }),
  })

  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err.error?.message || `API error ${response.status}`)
  }

  const data = await response.json()
  const raw = data.content[0].text.trim()

  // Parse quote attribution if present
  if (postType === 'quote') {
    const lines = raw.split('\n').filter(Boolean)
    if (lines.length >= 2 && lines[lines.length - 1].startsWith('—')) {
      const attribution = lines[lines.length - 1]
      const text = lines.slice(0, lines.length - 1).join(' ')
      return { text, attribution }
    }
  }

  return { text: raw, attribution: null }
}
