const API_KEY = process.env.REACT_APP_LOL_API_KEY;

export const fetchPUUID = async (gameName, tagLine) => {
  const response = await fetch(`/riot/riot/account/v1/accounts/by-riot-id/${gameName}/${tagLine}?api_key=${API_KEY}`);
  const data = await response.json();
  return data;
};

export const fetchSummonerByPUUID = async (puuid) => {
  const response = await fetch(`/br1/lol/summoner/v4/summoners/by-puuid/${puuid}?api_key=${API_KEY}`);
  const data = await response.json();
  return data;
};

export const fetchRankData = async (summonerId) => {
  const response = await fetch(`/br1/lol/league/v4/entries/by-summoner/${summonerId}?api_key=${API_KEY}`);
  const data = await response.json();
  return data;
};
