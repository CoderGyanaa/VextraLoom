import dns from 'dns';
import mongoose from 'mongoose';
import { config } from './env';

const maskUri = (uri: string): string => {
  return uri.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@');
};

const isDnsSrvError = (error: unknown): boolean => {
  if (error instanceof Error) {
    return error.message.includes('querySrv ECONNREFUSED') || 
           error.message.includes('querySrv ENOTFOUND');
  }
  return false;
};

export const connectDB = async (): Promise<boolean> => {
  if (!config.mongoUri) {
    console.log('[Database] MONGODB_URI not provided. Server will run without active database connection.');
    return false;
  }

  const maskedUri = maskUri(config.mongoUri);
  console.log(`[Database] Connecting to MongoDB Atlas (${maskedUri})...`);

  try {
    // 1. Attempt connection using standard host/container DNS resolver
    await mongoose.connect(config.mongoUri, {
      dbName: config.dbName,
      serverSelectionTimeoutMS: 5000
    });

    console.log(`[Database] Successfully connected to MongoDB Atlas. Active database: ${config.dbName}`);
    return true;
  } catch (error) {
    // 2. Only apply DNS fallback if the error is specifically a DNS SRV resolution refusal
    if (isDnsSrvError(error)) {
      console.warn('[Database] System DNS failed to resolve MongoDB Atlas SRV record (querySrv error).');
      console.warn(`[Database] Applying fallback DNS resolvers (${config.dnsServers.join(', ')}) and retrying connection...`);

      try {
        dns.setServers(config.dnsServers);
        await mongoose.connect(config.mongoUri, {
          dbName: config.dbName,
          serverSelectionTimeoutMS: 5000
        });

        console.log(`[Database] Successfully connected to MongoDB Atlas via DNS fallback. Active database: ${config.dbName}`);
        return true;
      } catch (retryError) {
        console.error('[Database] Failed to connect to MongoDB Atlas after DNS fallback:', retryError instanceof Error ? retryError.message : retryError);
        return false;
      }
    }

    console.error('[Database] Failed to connect to MongoDB Atlas:', error instanceof Error ? error.message : error);
    return false;
  }
};

export const disconnectDB = async (): Promise<void> => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
    console.log('[Database] Disconnected from MongoDB Atlas.');
  }
};
