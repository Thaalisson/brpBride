const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Carregar variáveis de ambiente do .env na raiz do projeto
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const API_KEY = process.env.API_KEY; // Usar a variável de ambiente
console.log("Server started on port 4000 with API_KEY: " + API_KEY);

app.use(cors({ origin: '*' }));

app.get('/account/v1/accounts/by-riot-id/*', async (req, res) => {
  try {
    const fetch = (await import('node-fetch')).default;
    const apiUrl = `https://americas.api.riotgames.com/lol${req.path}?api_key=${API_KEY}`;
    console.log('Fetching from:', apiUrl);
    const response = await fetch(apiUrl);
    res.json(await response.json());
  } catch (error) {
    console.error('Error fetching:', error);
    res.status(500).json({ error: error.toString() });
  }
});

app.get('/lol/summoner/v4/summoners/by-puuid/*', async (req, res) => {
  try {
    const fetch = (await import('node-fetch')).default;
    const apiUrl = `https://br1.api.riotgames.com/lol${req.path}?api_key=${API_KEY}`;
    console.log('Fetching from:', apiUrl);
    const response = await fetch(apiUrl);
    res.json(await response.json());
  } catch (error) {
    console.error('Error fetching:', error);
    res.status(500).json({ error: error.toString() });
  }
});

app.get('/lol/league/v4/entries/by-summoner/*', async (req, res) => {
  try {
    const fetch = (await import('node-fetch')).default;
    const apiUrl = `https://br1.api.riotgames.com/lol${req.path}?api_key=${API_KEY}`;
    console.log('Fetching from:', apiUrl);
    const response = await fetch(apiUrl);
    res.json(await response.json());
  } catch (error) {
    console.error('Error fetching:', error);
    res.status(500).json({ error: error.toString() });
  }
});

app.listen(4000, function () {
  console.log("Server started on port 4000");
});
