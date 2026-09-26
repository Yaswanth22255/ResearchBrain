const { generateGroundedSummary } = require('../services/rag/llmService');
const Paper = require('../models/Paper');

// @desc    Generate grounded summary from selected papers
// @route   POST /api/summaries
exports.createSummary = async (req, res, next) => {
  try {
    const { query, paperIds } = req.body;

    if (!paperIds || paperIds.length === 0) {
      return res.status(400).json({ message: 'No literature selected for grounding.' });
    }

    const papers = await Paper.find({ _id: { $in: paperIds } });
    
    if (papers.length === 0) {
      return res.status(400).json({ message: 'Selected papers not found.' });
    }

    const result = await generateGroundedSummary(papers, query);

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to generate summary' });
  }
};
