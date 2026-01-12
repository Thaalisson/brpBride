const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const API_KEY = process.env.API_KEY;
const CACHE_TTL_MS = 15 * 60 * 1000;
const MATCH_COUNT = 5;
const cache = new Map();
const inflight = new Map();
const players = require('../../src/data/players.json');

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

const elo = (tierName) => {
  switch (tierName) {
    case 'IRON':
      return 0;
    case 'BRONZE':
      return 1;
    case 'SILVER':
      return 2;
    case 'GOLD':
      return 3;
    case 'PLATINUM':
      return 4;
    case 'EMERALD':
      return 5;
    case 'DIAMOND':
      return 6;
    case 'MASTER':
      return 7;
    case 'GRANDMASTER':
      return 8;
    case 'CHALLENGER':
      return 9;
    default:
      return -1;
  }
};

const tier = (tierName) => {
  switch (tierName) {
    case 'I':
      return 4;
    case 'II':
      return 3;
    case 'III':
      return 2;
    case 'IV':
      return 1;
    default:
      return -1;
  }
};

const comparePlayers = (a, b) => {
  const tierA = a.rank && a.rank.length > 0 ? a.rank[0]?.tier || 'UNRANKED' : 'UNRANKED';
  const tierB = b.rank && b.rank.length > 0 ? b.rank[0]?.tier || 'UNRANKED' : 'UNRANKED';
  const rankA = a.rank && a.rank.length > 0 ? a.rank[0]?.rank || 'IV' : 'IV';
  const rankB = b.rank && b.rank.length > 0 ? b.rank[0]?.rank || 'IV' : 'IV';
  const pointsA = a.rank && a.rank.length > 0 ? a.rank[0]?.leaguePoints || 0 : 0;
  const pointsB = b.rank && b.rank.length > 0 ? b.rank[0]?.leaguePoints || 0 : 0;

  if (elo(tierA) !== elo(tierB)) {
    return elo(tierB) - elo(tierA);
  }
  if (tier(rankA) !== tier(rankB)) {
    return tier(rankB) - tier(rankA);
  }
  return pointsB - pointsA;
};

const runWithConcurrency = async (tasks, limit) => {
  const results = new Array(tasks.length);
  let nextIndex = 0;
  const workerCount = Math.min(limit, tasks.length);

  const workers = Array.from({ length: workerCount }, async () => {
    while (true) {
      const current = nextIndex;
      nextIndex += 1;
      if (current >= tasks.length) {
        break;
      }
      results[current] = await tasks[current]();
    }
  });

  await Promise.all(workers);
  return results;
};

async function fetchWithRetry(url, retries = 3, backoff = 3000) {
  const fetch = (await import('node-fetch')).default;

  for (let i = 0; i < retries; i++) {
    const response = await fetch(url);
    if (response.ok) {
      return response.json();
    }
    if (response.status === 429) {
      console.log(`Rate limit exceeded. Retrying in ${backoff}ms...`);
      await new Promise((resolve) => setTimeout(resolve, backoff));
      backoff *= 2;
    } else {
      throw new Error(`Error fetching data from Riot API: ${response.statusText}`);
    }
  }
  throw new Error(`Failed to fetch data after ${retries} retries`);
}

const buildRecentStats = (matches, puuid) => {
  const outcomes = [];
  let wins = 0;
  let kills = 0;
  let deaths = 0;
  let assists = 0;
  const championCounts = new Map();

  matches.forEach((match) => {
    const participant = match?.info?.participants?.find((entry) => entry.puuid === puuid);
    if (!participant) {
      return;
    }
    const didWin = !!participant.win;
    outcomes.push(didWin ? 'W' : 'L');
    wins += didWin ? 1 : 0;
    kills += participant.kills || 0;
    deaths += participant.deaths || 0;
    assists += participant.assists || 0;
    const championId = participant.championId;
    if (championId !== undefined && championId !== null) {
      const key = String(championId);
      championCounts.set(key, (championCounts.get(key) || 0) + 1);
    }
  });

  const totalGames = outcomes.length;
  if (!totalGames) {
    return null;
  }

  const winRate = Math.round((wins / totalGames) * 100);
  const kda = ((kills + assists) / Math.max(1, deaths)).toFixed(2);
  let streak = null;

  if (outcomes.length) {
    const first = outcomes[0];
    let count = 0;
    for (const result of outcomes) {
      if (result === first) {
        count += 1;
      } else {
        break;
      }
    }
    streak = `${first}${count}`;
  }

  const topChampions = Array.from(championCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([id, count]) => ({ id, count }));

  return {
    winRate,
    kda,
    streak,
    totalGames,
    topChampions
  };
};

const fetchPlayerData = async (player) => {
  try {
    const encodedGameName = encodeURIComponent(player.gameName);
    const encodedTagLine = encodeURIComponent(player.tagLine);
    const accountUrl = `https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodedGameName}/${encodedTagLine}?api_key=${API_KEY}`;
    const account = await fetchWithRetry(accountUrl);

    const summonerUrl = `https://br1.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${account.puuid}?api_key=${API_KEY}`;
    const summoner = await fetchWithRetry(summonerUrl);

    const rankUrl = `https://br1.api.riotgames.com/lol/league/v4/entries/by-puuid/${account.puuid}?api_key=${API_KEY}`;
    const rankData = await fetchWithRetry(rankUrl);

    let mainChampionId = null;
    try {
      const masteryUrl = `https://br1.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-puuid/${account.puuid}?api_key=${API_KEY}`;
      const masteryData = await fetchWithRetry(masteryUrl);
      if (Array.isArray(masteryData) && masteryData.length > 0) {
        mainChampionId = masteryData[0]?.championId ?? null;
      }
    } catch (error) {
      console.error('Error fetching mastery:', player, error);
    }

    let recentStats = null;
    try {
      const matchIdsUrl = `https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/${account.puuid}/ids?count=${MATCH_COUNT}&api_key=${API_KEY}`;
      const matchIds = await fetchWithRetry(matchIdsUrl);
      if (Array.isArray(matchIds) && matchIds.length > 0) {
        const matches = [];
        for (const matchId of matchIds) {
          try {
            const matchUrl = `https://americas.api.riotgames.com/lol/match/v5/matches/${matchId}?api_key=${API_KEY}`;
            const match = await fetchWithRetry(matchUrl);
            matches.push(match);
          } catch (error) {
            console.error('Error fetching match detail:', matchId, error);
          }
        }
        recentStats = buildRecentStats(matches, account.puuid);
      }
    } catch (error) {
      console.error('Error fetching match ids:', player, error);
    }

    if (!Array.isArray(rankData) || rankData.length === 0) {
      return {
        ...player,
        account,
        summoner,
        rank: [{ tier: 'UNRANKED', rank: 'IV', leaguePoints: 0 }],
        activeGame: false,
        mainChampionId,
        recentStats
      };
    }

    const rank = rankData.find((entry) => entry.queueType === 'RANKED_SOLO_5x5') || rankData[0];
    return {
      ...player,
      account,
      summoner,
      rank: [rank],
      activeGame: false,
      mainChampionId,
      recentStats
    };
  } catch (error) {
    console.error('Error fetching player:', player, error);
    return null;
  }
};

exports.handler = async () => {
  if (!API_KEY) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Missing API_KEY.' })
    };
  }

  const cacheKey = 'rankings';
  const cached = getCache(cacheKey);
  if (cached) {
    return {
      statusCode: 200,
      headers: {
        'Cache-Control': 'public, max-age=900, s-maxage=900'
      },
      body: JSON.stringify(cached)
    };
  }

  if (inflight.has(cacheKey)) {
    const data = await inflight.get(cacheKey);
    return {
      statusCode: 200,
      headers: {
        'Cache-Control': 'public, max-age=900, s-maxage=900'
      },
      body: JSON.stringify(data)
    };
  }

  const fetchPromise = (async () => {
    const tasks = players.map((player) => () => fetchPlayerData(player));
    const allPlayersData = await runWithConcurrency(tasks, 2);
    const filteredPlayersData = allPlayersData.filter((data) => data !== null);
    const sortedPlayersData = filteredPlayersData.sort(comparePlayers);
    const payload = {
      fetchedAt: Date.now(),
      expiresAt: Date.now() + CACHE_TTL_MS,
      players: sortedPlayersData
    };
    setCache(cacheKey, payload);
    return payload;
  })().finally(() => {
    inflight.delete(cacheKey);
  });

  inflight.set(cacheKey, fetchPromise);

  try {
    const data = await fetchPromise;
    return {
      statusCode: 200,
      headers: {
        'Cache-Control': 'public, max-age=900, s-maxage=900'
      },
      body: JSON.stringify(data)
    };
  } catch (error) {
    console.error('Error fetching rankings:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.toString() })
    };
  }
};
