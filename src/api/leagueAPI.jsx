const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://brprank.netlify.app/.netlify/functions';

const CACHE_TTL_MS = 15 * 60 * 1000;
const cache = new Map();

const getCache = (key) => {
  const entry = cache.get(key);
  if (!entry) {
    return null;
  }
  if (Date.now() - entry.time > CACHE_TTL_MS) {
    cache.delete(key);
    return null;
  }
  return entry.value;
};

const setCache = (key, value) => {
  cache.set(key, { time: Date.now(), value });
};

const queue = [];
let processingQueue = false;
const queueDelayMs = 250;

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const processQueue = async () => {
  if (processingQueue) {
    return;
  }
  processingQueue = true;
  while (queue.length) {
    const { task, resolve, reject } = queue.shift();
    try {
      const result = await task();
      resolve(result);
    } catch (error) {
      reject(error);
    }
    await delay(queueDelayMs);
  }
  processingQueue = false;
};

const enqueue = (task) => new Promise((resolve, reject) => {
  queue.push({ task, resolve, reject });
  processQueue();
});

const fetchJson = async (url, errorLabel) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`${errorLabel}: ${response.statusText}`);
  }
  return response.json();
};

let championDataCache = null;
let championDataPromise = null;

export const fetchChampionData = async () => {
  if (championDataCache) {
    return championDataCache;
  }
  if (championDataPromise) {
    return championDataPromise;
  }
  championDataPromise = fetch('https://ddragon.leagueoflegends.com/cdn/12.18.1/data/en_US/champion.json')
    .then((response) => response.json())
    .then((data) => {
      const championMap = {};
      Object.values(data.data).forEach((champion) => {
        championMap[champion.key] = champion.id;
      });
      championDataCache = championMap;
      return championMap;
    })
    .finally(() => {
      championDataPromise = null;
    });
  return championDataPromise;
};

export const fetchRankings = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/rankings`);
    if (!response.ok) {
      throw new Error(`Error fetching rankings: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching rankings:', error);
    return null;
  }
};

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

export const fetchTftSummonerByPUUID = async (puuid) => {
  try {
    const response = await fetch(`${API_BASE_URL}/summoner/tft/summoner/v1/summoners/by-puuid/${puuid}`);
    if (!response.ok) {
      throw new Error(`Error fetching TFT Summoner: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching TFT Summoner:', error);
    return null;
  }
};

export const fetchTftRankData = async (puuid) => {
  try {
    const response = await fetch(`${API_BASE_URL}/summoner/tft/league/v1/by-puuid/${puuid}`);
    if (!response.ok) {
      throw new Error(`Error fetching TFT rank data: ${response.statusText}`);
    }
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error fetching TFT rank data:', error);
    return [];
  }
};

export const fetchMatchIds = async (puuid, count = 5) => {
  const url = `${API_BASE_URL}/match/lol/match/v5/matches/by-puuid/${puuid}/ids?count=${count}`;
  const cached = getCache(url);
  if (cached) {
    return cached;
  }

  try {
    const data = await enqueue(() => fetchJson(url, 'Error fetching match ids'));
    const result = Array.isArray(data) ? data : [];
    setCache(url, result);
    return result;
  } catch (error) {
    console.error('Error fetching match ids:', error);
    return [];
  }
};

export const fetchMatchDetail = async (matchId) => {
  const url = `${API_BASE_URL}/match/lol/match/v5/matches/${matchId}`;
  const cached = getCache(url);
  if (cached) {
    return cached;
  }

  try {
    const data = await enqueue(() => fetchJson(url, 'Error fetching match detail'));
    setCache(url, data);
    return data;
  } catch (error) {
    console.error('Error fetching match detail:', error);
    return null;
  }
};
