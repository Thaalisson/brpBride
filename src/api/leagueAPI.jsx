const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://brprank.netlify.app/.netlify/functions';

export const fetchPUUID = async (gameName, tagLine) => {
  try {
    const response = await fetch(`${API_BASE_URL}/riot/account/v1/accounts/by-riot-id/${gameName}/${tagLine}`);
    if (!response.ok) {
      throw new Error(`Error fetching PUUID: ${response.statusText}`);
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
    const response = await fetch(`${API_BASE_URL}/summoner/lol/summoner/v4/summoners/by-puuid/${puuid}`);
    if (!response.ok) {
      throw new Error(`Error fetching Summoner: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching Summoner:', error);
    return null;
  }
};

export const fetchRankData = async (summonerId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/summoner/lol/league/v4/entries/by-summoner/${summonerId}`);
    if (!response.ok) {
      throw new Error(`Error fetching rank data: ${response.statusText}`);
    }
    const data = await response.json();
    if (!Array.isArray(data)) {
      throw new Error('Expected an array but got something else');
    }
    return data;
  } catch (error) {
    console.error('Error fetching rank data:', error);
    return [];
  }
};

export const fetchActiveGame = async (summonerId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/summoner/lol/spectator/v5/active-games/by-summoner/${summonerId}`);
    if (!response.ok) {
      if (response.status === 404) {
        return null; 
      }
      throw new Error(`Error fetching active game data: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching active game data:', error);
    return null;
  }
};


export const fetchChampionMastery = async (puuid) => {
  try {
    const response = await fetch(`${API_BASE_URL}/summoner/lol/champion-mastery/v4/champion-masteries/by-puuid/${puuid}`);
    if (!response.ok) {
      throw new Error(`Error fetching champion mastery: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching champion mastery:', error);
    return null;
  }
};
