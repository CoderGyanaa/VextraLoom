import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Check possible .env file locations (current working directory, server root, or project root)
const possibleEnvPaths = [
  path.resolve(process.cwd(), '.env'),
  path.resolve(__dirname, '../../.env'),
  path.resolve(__dirname, '../../../.env')
];

for (const envPath of possibleEnvPaths) {
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
    break;
  }
}

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoUri: process.env.MONGODB_URI || '',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  dbName: 'vextraloom',
  dnsServers: process.env.DNS_SERVERS
    ? process.env.DNS_SERVERS.split(',').map(s => s.trim())
    : ['8.8.8.8', '1.1.1.1']
};
