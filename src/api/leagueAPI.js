const API_KEY = process.env.REACT_APP_LOL_API_KEY;

export const fetchPUUID = async (gameName, tagLine) => {
  try {
    const response = await fetch(`/riot/riot/account/v1/accounts/by-riot-id/${gameName}/${tagLine}?api_key=${API_KEY}`);
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching PUUID:', error);
    return null;
  }
};

export const fetchSummonerByPUUID = async (puuid) => {
  try {
    const response = await fetch(`/br1/lol/summoner/v4/summoners/by-puuid/${puuid}?api_key=${API_KEY}`);
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching summoner by PUUID:', error);
    return null;
  }
};

export const fetchRankData = async (summonerId) => {
  try {
    const response = await fetch(`/br1/lol/league/v4/entries/by-summoner/${summonerId}?api_key=${API_KEY}`);
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching rank data:', error);
    return null;
  }
};
