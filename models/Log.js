const mongoose = require('mongoose');

const LogSchema = new mongoose.Schema({
  tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant' },
  schedule: { type: String },
  status: { type: String }, 
  response: { type: String },
  send_time: { type: Date, default: Date.now }
});

module.exports = mongoose.models.Log || mongoose.model('Log', LogSchema);