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

export const fetchRankData = async (puuid) => {
  try {
    const response = await fetch(`${API_BASE_URL}/summoner/lol/league/v4/entries/by-puuid/${puuid}`);
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
 
        return null;
  
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

export const fetchMatchIds = async (puuid, count = 10) => {
  try {
    const response = await fetch(`${API_BASE_URL}/match/lol/match/v5/matches/by-puuid/${puuid}/ids?count=${count}`);
    if (!response.ok) {
      throw new Error(`Error fetching match ids: ${response.statusText}`);
    }
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error fetching match ids:', error);
    return [];
  }
};

export const fetchMatchDetail = async (matchId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/match/lol/match/v5/matches/${matchId}`);
    if (!response.ok) {
      throw new Error(`Error fetching match detail: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching match detail:', error);
    return null;
  }
};

