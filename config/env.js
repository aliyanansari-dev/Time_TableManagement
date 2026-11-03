/**
 * Environment Configuration Manager
 * Government College of Technology (GCT), Bhakkar
 */

const dotenv = require('dotenv');
dotenv.config();

const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '5000', 10),
  mongoUri: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/gct_cit_db',
  jwtSecret: process.env.JWT_SECRET || 'gct_bhakkar_cit_secure_token_secret_2026',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'gct_bhakkar_cit_refresh_token_secret_2026',
  logLevel: process.env.LOG_LEVEL || 'info',
  tenantId: process.env.TENANT_ID || 'GCT_BHAKKAR_CIT'
};

module.exports = config;
