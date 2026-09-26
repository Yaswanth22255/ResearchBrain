const axios = require('axios');

const OPENALEX_API = 'https://api.openalex.org/works';

/**
 * Normalizes OpenAlex response into our standard internal Paper format.
 */
const normalizeOpenAlexPaper = (work) => {
  return {
    title: work.title,
    authors: work.authorships?.map(a => a.author.display_name) || [],
    year: work.publication_year,
    venue: work.primary_location?.source?.display_name || 'Unknown Venue',
    abstract: work.abstract_inverted_index ? invertAbstract(work.abstract_inverted_index) : 'No abstract available.',
    source: 'OpenAlex',
    doi: work.doi ? work.doi.replace('https://doi.org/', '') : null,
    openAlexId: work.id,
    relevanceScore: work.relevance_score || 0
  };
};

/**
 * OpenAlex provides abstract as inverted index, we need to reconstruct it.
 */
const invertAbstract = (invertedIndex) => {
  const words = [];
  for (const [word, positions] of Object.entries(invertedIndex)) {
    for (const pos of positions) {
      words[pos] = word;
    }
  }
  return words.join(' ').replace(/\s+/g, ' ').trim();
};

exports.searchOpenAlex = async (query, yearStart) => {
  try {
    // Basic search on OpenAlex
    const params = {
      search: query,
      filter: `publication_year:>${yearStart - 1}`,
      per_page: 20
    };

    const response = await axios.get(OPENALEX_API, { params });
    const works = response.data.results || [];
    
    return works.map(normalizeOpenAlexPaper);
  } catch (error) {
    console.error('OpenAlex API Error:', error.message);
    throw new Error('Failed to fetch from OpenAlex');
  }
};
