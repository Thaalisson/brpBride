const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const API_KEY = process.env.API_KEY;

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
  const apiPath = event.path.replace("/.netlify/functions/match", "");
  const queryParams = new URLSearchParams(event.queryStringParameters || {});
  queryParams.set("api_key", API_KEY);
  const apiUrl = `https://americas.api.riotgames.com${apiPath}?${queryParams.toString()}`;
  console.log('Fetching from:', apiUrl);

  try {
    const data = await fetchWithRetry(apiUrl);
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error('Error fetching:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.toString() }),
    };
  }
};
