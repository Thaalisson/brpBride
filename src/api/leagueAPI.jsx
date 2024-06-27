const API_KEY = process.env.REACT_APP_LOL_API_KEY;

export const fetchPUUID = async (gameName, tagLine) => {
  try {
    const url = `https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}?api_key=${API_KEY}`;
    console.log('Fetching PUUID from URL:', url);
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText} (status: ${response.status})`);
    }
    const data = await response.json();
    console.log('Data:', data);
    return data;
  } catch (error) {
    console.error('Error fetching PUUID:', error.message);
    return null;
  }
};

export const fetchSummonerByPUUID = async (puuid) => {
  try {
    const url = `https://br1.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}?api_key=${API_KEY}`;
    console.log('Fetching Summoner by PUUID from URL:', url);
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText} (status: ${response.status})`);
    }
    const data = await response.json();
    console.log('Data:', data);
    return data;
  } catch (error) {
    console.error('Error fetching summoner by PUUID:', error.message);
    return null;
  }
};

export const fetchRankData = async (summonerId) => {
  try {
    const url = `https://br1.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerId}?api_key=${API_KEY}`;
    console.log('Fetching Rank Data from URL:', url);
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText} (status: ${response.status})`);
    }
    const data = await response.json();
    console.log('Data:', data);
    return data;
  } catch (error) {
    console.error('Error fetching rank data:', error.message);
    return null;
  }
};
