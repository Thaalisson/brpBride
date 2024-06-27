// src/api/leagueAPI.js

const API_KEY = process.env.REACT_APP_LOL_API_KEY;

export const fetchPUUID = async (gameName, tagLine) => {
  try {
    const response = await fetch(`https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${gameName}/${tagLine}?api_key=${API_KEY}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch PUUID error:', error);
    return null;
  }
};

export const fetchSummonerByPUUID = async (puuid, region) => {
  try {
    const response = await fetch(`https://${region}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}?api_key=${API_KEY}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch Summoner by PUUID error:', error);
    return null;
  }
};

export const fetchRankData = async (summonerId, region) => {
  try {
    const response = await fetch(`https://${region}.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerId}?api_key=${API_KEY}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch Rank Data error:', error);
    return [];
  }
};
