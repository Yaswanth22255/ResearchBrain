const Paper = require('../../models/Paper');

/**
 * Neuro-symbolic verification engine.
 */
exports.verifyCitationAndClaim = async (claimData) => {
  const result = {
    claim: claimData.claim,
    citations: [],
    status: 'VERIFIED',
    checks: {
      citationExists: true,
      metadataMatches: true,
      evidenceFound: true,
      evidenceRelevant: true
    },
    message: 'Verification passed.'
  };

  try {
    // Symbolic Rule 1: Every scientific claim must have supporting evidence
    if (!claimData.citationIds || claimData.citationIds.length === 0) {
      result.status = 'INSUFFICIENT_EVIDENCE';
      result.checks.evidenceFound = false;
      result.message = 'No citations provided for claim.';
      return result;
    }

    // Symbolic Rule 2: Citation must correspond to an identifiable paper
    const papers = await Paper.find({ _id: { $in: claimData.citationIds } });
    if (papers.length !== claimData.citationIds.length) {
      result.status = 'UNSUPPORTED';
      result.checks.citationExists = false;
      result.message = 'One or more cited papers do not exist in the database.';
      return result;
    }

    // Neural Component (Mocked for demo: LLM-based evidence analysis)
    // In a real system, we would query the LLM to verify if the abstract supports the claim.
    result.citations = papers.map(p => ({
      title: p.title,
      id: p._id
    }));

    return result;
  } catch (error) {
    console.error('Verification error', error);
    result.status = 'ERROR';
    result.message = 'System error during verification.';
    return result;
  }
};
