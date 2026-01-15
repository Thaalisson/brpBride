const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const API_KEY = process.env.API_KEY;
const API_TFT_KEY = process.env.API_TFT_KEY;
const CACHE_TTL_MS = 15 * 60 * 1000;
const cache = new Map();
const inflight = new Map();

const getCache = (key) => {
  const entry = cache.get(key);
  if (!entry) {
    return null;
  }
  if (Date.now() - entry.time > CACHE_TTL_MS) {
    cache.delete(key);
    return null;
  }
  return entry.value;
};

const setCache = (key, value) => {
  cache.set(key, { time: Date.now(), value });
};

async function fetchWithRetry(url, retries = 3, backoff = 3000) {
  const fetch = (await import('node-fetch')).default;

  for (let i = 0; i < retries; i++) {
    const response = await fetch(url);
    if (response.ok) {
      return response.json();
    }
    if (response.status === 429) {
      console.log(`Rate limit exceeded. Retrying in ${backoff}ms...`);
      await new Promise((resolve) => setTimeout(resolve, backoff));
      backoff *= 2;
    } else {
      throw new Error(`Error fetching data from Riot API: ${response.statusText}`);
    }
  }
  throw new Error(`Failed to fetch data after ${retries} retries`);
}

exports.handler = async (event) => {
  const apiPath = event.path.replace('/.netlify/functions/match', '');
  const queryParams = new URLSearchParams(event.queryStringParameters || {});
  const key = apiPath.startsWith('/tft/') ? (API_TFT_KEY || API_KEY) : API_KEY;
  queryParams.set('api_key', key);
  const cacheKey = `${apiPath}?${queryParams.toString()}`;
  const cached = getCache(cacheKey);

  if (cached) {
    return {
      statusCode: 200,
      headers: {
        'Cache-Control': 'public, max-age=900'
      },
      body: JSON.stringify(cached)
    };
  }

  if (inflight.has(cacheKey)) {
    const data = await inflight.get(cacheKey);
    return {
      statusCode: 200,
      headers: {
        'Cache-Control': 'public, max-age=900'
      },
      body: JSON.stringify(data)
    };
  }

  const apiUrl = `https://americas.api.riotgames.com${apiPath}?${queryParams.toString()}`;
  console.log('Fetching from:', apiUrl);

  const fetchPromise = fetchWithRetry(apiUrl)
    .then((data) => {
      setCache(cacheKey, data);
      return data;
    })
    .finally(() => {
      inflight.delete(cacheKey);
    });

  inflight.set(cacheKey, fetchPromise);

  try {
    const data = await fetchPromise;
    return {
      statusCode: 200,
      headers: {
        'Cache-Control': 'public, max-age=900'
      },
      body: JSON.stringify(data)
    };
  } catch (error) {
    console.error('Error fetching:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.toString() })
    };
  }
};
