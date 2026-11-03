const mongoose = require('mongoose');
const config = require('./env');

async function connectDatabase() {
  try {
    const conn = await mongoose.connect(config.mongoUri);
    console.log(`[DB] Connected to MongoDB at ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (err) {
    console.warn(`[DB] Local MongoDB connection notice: ${err.message}`);
    return null;
  }
}

module.exports = { connectDatabase };
