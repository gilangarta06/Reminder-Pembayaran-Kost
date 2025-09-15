const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('MONGO_URI not set in .env');
}

let cached = global._mongoose;
  
async function connect() {
  if (cached) return cached;
  const conn = await mongoose.connect(MONGO_URI, {
  });
  cached = conn;
  global._mongoose = conn;
  console.log('MongoDB connected');
  return conn;
}

module.exports = connect;