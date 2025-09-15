const mongoose = require('mongoose');

const TenantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true }, 
  room: { type: String },
  rent_amount: { type: Number, default: 0 },
  due_date: { type: Date, required: true },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.models.Tenant || mongoose.model('Tenant', TenantSchema);