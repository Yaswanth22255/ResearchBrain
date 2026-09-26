const { verifyCitationAndClaim } = require('../services/verification/verifyService');

exports.verifyClaims = async (req, res, next) => {
  try {
    const { claims } = req.body; // claims to verify

    if (!claims || claims.length === 0) {
      return res.status(400).json({ message: 'No claims provided.' });
    }

    const verificationResults = await Promise.all(claims.map(verifyCitationAndClaim));

    res.status(200).json(verificationResults);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Verification failed' });
  }
};
