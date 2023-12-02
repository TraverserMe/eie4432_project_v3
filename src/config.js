// Import the dotenv package
import dotenv from 'dotenv';

// Run dotenv.config() at the top level
dotenv.config();

// Check if "process.env.CONNECTION_STR" is defined
if (!process.env.CONNECTION_STR) {
  console.error('CONNECTION_STR is not defined');
  process.exit(1);
}

// Export an object containing CONNECTION_STR as the default export
export default { 
  CONNECTION_STR: process.env.CONNECTION_STR, 
  API_KEY: process.env.API_KEY,
  AUTH_DOMAIN: process.env.AUTH_DOMAIN,
  PROJECT_ID: process.env.PROJECT_ID,
  STORAGE_BUCKET: process.env.STORAGE_BUCKET,
  MESSAGING_SENDER_ID: process.env.MESSAGING_SENDER_ID,
  APP_ID: process.env.APP_ID,
  MEASUREMENT_ID: process.env.MEASUREMENT_ID
};
