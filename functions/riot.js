export async function handler(event, context) {
    const fetch = (await import('node-fetch')).default;
  
    console.log('Request received:', event.path);
    const API_KEY = process.env.RIOT_API_KEY; // Defina a chave API no arquivo .env
    const path = event.path.replace('/.netlify/functions/riot', '');
    const apiUrl = `https://americas.api.riotgames.com${path}?api_key=${API_KEY}`;
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
  