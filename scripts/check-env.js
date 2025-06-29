const fs = require('fs');
const path = require('path');

// Helper to parse .env files
function parseEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return {};
  const lines = fs.readFileSync(filePath, 'utf-8').split('\n');
  const env = {};
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const [key, ...rest] = trimmed.split('=');
    env[key] = rest.join('=').replace(/^"|"$/g, '');
  }
  return env;
}

// Get .env.local or .env
const envPath = fs.existsSync('.env.local') ? '.env.local' : '.env';
const env = parseEnvFile(envPath);

const apiUrl = env.NEXT_PUBLIC_API_BASE_URL || '';
const portFromEnv = process.env.PORT || 3000;

// Extract port from API URL
const match = apiUrl.match(/:(\d+)\//);
const apiPort = match ? match[1] : null;

if (apiPort && parseInt(apiPort) !== parseInt(portFromEnv)) {
  console.warn(`\x1b[33m[WARNING]\x1b[0m NEXT_PUBLIC_API_BASE_URL port (${apiPort}) does not match intended dev server port (${portFromEnv}).`);
  console.warn(`         Update .env.local or start the dev server with PORT=${apiPort} to match.`);
} else {
  console.log(`\x1b[32m[OK]\x1b[0m NEXT_PUBLIC_API_BASE_URL matches intended dev server port (${portFromEnv}).`);
} 