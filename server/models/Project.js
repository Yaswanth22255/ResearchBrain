const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  domain: {
    type: String,
    trim: true,
  },
  subdomain: {
    type: String,
    trim: true,
  },
  keywords: [{
    type: String,
  }],
  constraints: {
    yearStart: Number,
    yearEnd: Number,
    methodology: String,
  },
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
