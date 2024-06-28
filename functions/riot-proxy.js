const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  const API_KEY = process.env.REACT_APP_LOL_API_KEY;
  const path = event.path.replace('/.netlify/functions/riot-proxy', '');
  
  let riotApiBaseUrl;
  if (path.includes('/lol/league/v4/entries/by-summoner') || path.includes('/lol/summoner/v4/summoners/by-puuid')) {
    riotApiBaseUrl = 'https://br1.api.riotgames.com';
  } else {
    riotApiBaseUrl = 'https://americas.api.riotgames.com';
  }

  const riotUrl = `${riotApiBaseUrl}${path}${path.includes('?') ? '&' : '?'}api_key=${API_KEY}`;

  console.log('Requesting URL:', riotUrl);

  try {
    const response = await fetch(riotUrl, {
      method: event.httpMethod,
      headers: {
        'Content-Type': 'application/json',
        ...event.headers
      },
      body: event.body
    });

    const data = await response.json();

    return {
      statusCode: response.status,
      body: JSON.stringify(data)
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch data from Riot API' })
    };
  }
};
