const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());

const API_KEY = REACT_APP_LOL_API_KEY;  // Use a sua API_KEY aqui

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

app.listen(4000, function () {
  console.log("Server started on port 4000");
});
