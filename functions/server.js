const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');

const app = express();
app.use(cors());

const API_KEY = 'RGAPI-879f2bda-3d0d-45bf-b3a2-84582465ac81';  // Use a sua API_KEY aqui

app.get('/riot/*', async (req, res) => {
  try {
    const fetch = (await import('node-fetch')).default;
    const apiUrl = `https://americas.api.riotgames.com${req.path.replace('/riot', '')}?api_key=${API_KEY}`;
    console.log('Fetching from:', apiUrl);
    const response = await fetch(apiUrl);
    res.json(await response.json());
  } catch (error) {
    console.error('Error fetching:', error);
    res.status(500).json({ error: error.toString() });
  }
});

app.get('/br1/*', async (req, res) => {
  try {
    const fetch = (await import('node-fetch')).default;
    const apiUrl = `https://br1.api.riotgames.com${req.path.replace('/br1', '')}?api_key=${API_KEY}`;
    console.log('Fetching from:', apiUrl);
    const response = await fetch(apiUrl);
    res.json(await response.json());
  } catch (error) {
    console.error('Error fetching:', error);
    res.status(500).json({ error: error.toString() });
  }
});

module.exports.handler = serverless(app);
