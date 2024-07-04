const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  const API_KEY = 'RGAPI-721d309c-5851-44c1-af4c-ca58a0c58664';  // Use a sua API_KEY aqui

  const path = event.path.replace('/.netlify/functions/riot-proxy', '');
  let apiUrl;
  
  if (path.includes('/riot')) {
    apiUrl = `https://americas.api.riotgames.com${path.replace('/riot', '')}?api_key=${API_KEY}`;
  } else if (path.includes('/br1')) {
    apiUrl = `https://br1.api.riotgames.com${path.replace('/br1', '')}?api_key=${API_KEY}`;
  } else {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid path' })
    };
  }

  console.log('Fetching from:', apiUrl);

  try {
    const response = await fetch(apiUrl, {
      method: event.httpMethod,
      headers: { ...event.headers },
      body: event.body
    });

    const data = await response.json();

    return {
      statusCode: response.status,
      body: JSON.stringify(data)
    };
  } catch (error) {
    console.error('Error fetching:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch data from Riot API' })
    };
  }
};
