const API_KEY = process.env.REACT_APP_LOL_API_KEY;

export const fetchPUUID = async (gameName, tagLine) => {
  const response = await fetch(`https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${gameName}/${tagLine}?api_key=${API_KEY}`);
  const data = await response.json();
  return data;
};

export const fetchSummonerByPUUID = async (puuid, region) => {
  const response = await fetch(`https://${region}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}?api_key=${API_KEY}`);
  const data = await response.json();
  return data;
};

export const fetchRankData = async (summonerId, region) => {
  const response = await fetch(`https://${region}.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerId}?api_key=${API_KEY}`);
  const data = await response.json();
  return data;
};