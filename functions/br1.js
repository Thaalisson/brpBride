// Adicionando esta linha para importar dynamicamente o fetch
exports.handler = async function(event, context) {
    const fetch = (await import('node-fetch')).default;
  
    console.log('Request received:', event.path);
    const API_KEY = process.env.RIOT_API_KEY; // Defina a chave API no arquivo .env
    const apiUrl = `https://br1.api.riotgames.com${event.path.replace('/.netlify/functions/br1/br1', '')}?api_key=${API_KEY}`;
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
  