const fetch = require('node-fetch');
const dotenv = require('dotenv');
const path = require('path');

// Carregar variáveis de ambiente do .env na raiz do projeto
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const API_KEY = process.env.API_KEY;

exports.handler = async (event, context) => {
  const path = event.path.replace("/.netlify/functions/riot", "");
  const apiUrl = `https://americas.api.riotgames.com/riot${path}?api_key=${API_KEY}`;
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
