export const fetchPUUID = async (gameName, tagLine) => {
  try {
    const url = `riot/riot/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`;
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
    const url = `/br1/br1/br1/lol/summoner/v4/summoners/by-puuid/${encodeURIComponent(puuid)}`;
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
    const url = `/br1/lol/league/v4/entries/by-summoner/${encodeURIComponent(summonerId)}`;
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
