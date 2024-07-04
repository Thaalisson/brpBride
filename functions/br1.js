import fetch from 'node-fetch';

export async function handler(event, context) {
  console.log('Request received:', event.path);
  const API_KEY = process.env.RIOT_API_KEY; // Certifique-se de definir esta variável de ambiente no Netlify
  const path = event.path.replace('/.netlify/functions/br1', '');
  const apiUrl = `https://br1.api.riotgames.com${path}?api_key=${API_KEY}`;
  console.log('Fetching from:', apiUrl);

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
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
