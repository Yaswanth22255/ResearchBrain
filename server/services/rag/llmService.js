const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.LLM_API_KEY });

exports.generateGroundedSummary = async (papers, query) => {
  // Demo mode check
  if (!process.env.LLM_API_KEY || process.env.LLM_API_KEY === 'your_llm_api_key_here') {
    return {
      summary: "This is a simulated summary because the LLM API key is not configured. The retrieved literature suggests significant progress in mitigating LLM hallucinations using retrieval-augmented methods.",
      claims: [
        {
          claim: "Retrieval-augmented methods reduce hallucination.",
          citationIds: papers.slice(0, 1).map(p => p._id),
          evidenceIds: []
        }
      ]
    };
  }

  try {
    const context = papers.map(p => `Title: ${p.title}\nAuthors: ${p.authors.join(', ')}\nAbstract: ${p.abstract}`).join('\n\n');
    const prompt = `Based ONLY on the following literature, provide a summary addressing the query: "${query}".
    
Literature:
${context}

Format your output as a JSON object with:
1. "summary": A coherent summary paragraph.
2. "claims": An array of objects, each containing:
   - "claim": The specific scientific claim made.
   - "citationIds": Array of exact Titles from the literature that support this claim.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-pro',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const result = JSON.parse(response.text);
    
    // Map titles back to our DB IDs
    const claimsWithIds = result.claims.map(claim => {
      const ids = claim.citationIds.map(title => {
        const found = papers.find(p => p.title === title);
        return found ? found._id : null;
      }).filter(Boolean);
      return { ...claim, citationIds: ids, evidenceIds: [] };
    });

    return {
      summary: result.summary,
      claims: claimsWithIds
    };
  } catch (error) {
    console.error('LLM Generation Error:', error);
    throw new Error('Failed to generate summary');
  }
};
