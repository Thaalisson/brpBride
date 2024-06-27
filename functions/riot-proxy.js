const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  const API_KEY = process.env.REACT_APP_LOL_API_KEY;
  const path = event.path.replace('/.netlify/functions/riot-proxy', '');
  const riotUrl = `https://americas.api.riotgames.com${path}${path.includes('?') ? '&' : '?'}api_key=${API_KEY}`;

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
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch data from Riot API' })
    };
  }
};
