const { searchOpenAlex } = require('../services/academic-sources/openalex');
const Paper = require('../models/Paper');

// @desc    Search academic literature
// @route   POST /api/search
exports.searchLiterature = async (req, res, next) => {
  try {
    const { query, domain, subdomain, yearStart, projectId } = req.body;

    if (!query) {
      return res.status(400).json({ message: 'Research query is required' });
    }

    // Combine domain info into query if needed, or just use query for OpenAlex
    const searchQuery = `${domain ? domain + ' ' : ''}${subdomain ? subdomain + ' ' : ''}${query}`.trim();

    // 1. Fetch from Academic Source (OpenAlex)
    const results = await searchOpenAlex(searchQuery, parseInt(yearStart) || 2010);

    // 2. Normalize and Save to DB (optional: we might just return them first and let user save)
    // For now, let's just save them so they have IDs
    const savedPapers = [];
    for (let p of results) {
      // Upsert based on OpenAlex ID or DOI
      const filter = p.doi ? { doi: p.doi } : { openAlexId: p.openAlexId };
      p.projectId = projectId; // If we want to attach to project
      
      const doc = await Paper.findOneAndUpdate(filter, p, { new: true, upsert: true });
      savedPapers.push(doc);
    }

    // 3. Return Ranked Results (they are already sorted by relevance score by OpenAlex roughly)
    // We will do our own hybrid retrieval and ranking in Stage 3.
    res.status(200).json(savedPapers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error searching literature' });
  }
};
