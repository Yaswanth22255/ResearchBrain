const mongoose = require('mongoose');

const paperSchema = new mongoose.Schema({
  title: { type: String, required: true },
  authors: [{ type: String }],
  year: { type: Number },
  venue: { type: String },
  abstract: { type: String },
  source: { type: String }, // 'OpenAlex', 'PubMed', etc.
  doi: { type: String, unique: true, sparse: true },
  openAlexId: { type: String, unique: true, sparse: true },
  relevanceScore: { type: Number, default: 0 },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' }
}, { timestamps: true });

module.exports = mongoose.model('Paper', paperSchema);
