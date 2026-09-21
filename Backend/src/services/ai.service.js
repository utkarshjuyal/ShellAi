import { Mistral } from "@mistralai/mistralai";

// Initialize the official Mistral client
const mistral = new Mistral({
  apiKey: process.env.MISTRAL_API_KEY,
});

export async function generateSummaryAndTopics({ title, content, keywords, url }) {
  try {
    const response = await mistral.chat.complete({
      model: "mistral-small-latest",
      messages: [
        {
          role: "user",
          content: `You are an assistant for a knowledge management app.

Given the following webpage data:
Title: "${title}"
URL: "${url}"
Keywords: "${keywords}"
Content: "${content?.slice(0, 3000)}"

Your task:
1. Generate a concise summary (max 2 sentences). 
2. Extract 3-5 relevant topics that capture:
   - The DOMAIN (e.g., "government policy", "india politics")
   - The SUBJECT (e.g., "react hooks", "docker deployment")
   - The INTENT (e.g., "tutorial", "news", "analysis")
   Keep topics as 1-3 descriptive words.
3. Suggest AI-generated tags to enhance user-provided tags.

Guidelines:
- Use the title and keywords to improve accuracy.
- Do NOT invent information not present in the content.
- Keep topics short (1-3 words each).

Return ONLY valid JSON:
{
  "summary": "your summary here",
  "topics": ["topic1", "topic2"],
  "aiTags": ["tag1", "tag2"]
}`
        }
      ],
      responseFormat: { type: "json_object" }, // Forces valid JSON output
    });

    const text = response.choices[0].message.content;
    const parsed = JSON.parse(text);
    
    return {
      summary: parsed.summary || "",
      topics: parsed.topics || [],
      aiTags: parsed.aiTags || [],
    };
  } catch (error) {
    console.error("Error generating summary/topics:", error);
    return { summary: "", topics: [], aiTags: [] };
  }
}

export async function extractSearchKeywords(query) {
  try {
    const response = await mistral.chat.complete({
      model: "mistral-small-latest",
      messages: [
        {
          role: "user",
          content: `Extract the most important search keywords from this query. 
Remove stop words, filler words, and keep only meaningful terms.
Return ONLY a JSON array of strings, nothing else.

Query: "${query}"

Example: "how to make my react app faster" -> ["react", "performance", "optimization"]`
        }
      ],
      responseFormat: { type: "json_object" },
    });

    const text = response.choices[0].message.content;
    const cleaned = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleaned);
    
    // Handle both ["a", "b"] and {"keywords": ["a", "b"]} formats safely
    return Array.isArray(parsed) ? parsed : (parsed.keywords || []);
  } catch (error) {
    console.error("Error extracting keywords:", error);
    return query.toLowerCase().split(/\s+/).filter((w) => w.length > 3);
  }
}

export async function generateVectorFromQuery(query) {
  const response = await mistral.embeddings.create({
    model: "mistral-embed",
    inputs: [query],
  });
  return response.data[0].embedding;
}

export async function generateVectorFromData({ summary, title, topics, tags = [], content = "" }) {
  // Natural language formatting for better semantic understanding
  const text = `Title: ${title}. Summary: ${summary}. Main topics covered: ${topics.join(", ")}. Tags: ${tags.join(", ")}. Additional context: ${content ? content.slice(0, 1500) : ""}`.trim().replace(/\s+/g, " ");
  
  const response = await mistral.embeddings.create({
    model: "mistral-embed",
    inputs: [text],
  });
  return response.data[0].embedding;
}
