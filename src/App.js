import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import RankCard from './components/RankCard';
import { fetchPUUID, fetchSummonerByPUUID, fetchRankData } from './api/leagueAPI';
import './styles/App.css';

// Funções de comparação
const elo = (elo) => {
  switch (elo) {
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
      return -1; // Caso para valores inesperados
  }
};

const tier = (tier) => {
  switch (tier) {
    case 'I':
      return 4;
    case 'II':
      return 3;
    case 'III':
      return 2;
    case 'IV':
      return 1;
    default:
      return -1; // Caso para valores inesperados
  }
};

const comparePlayers = (a, b) => {
  const tierA = a.rank && a.rank.length > 0 ? a.rank[0].tier : 'UNRANKED';
  const tierB = b.rank && b.rank.length > 0 ? b.rank[0].tier : 'UNRANKED';
  const rankA = a.rank && a.rank.length > 0 ? a.rank[0].rank : 'IV';
  const rankB = b.rank && b.rank.length > 0 ? a.rank[0].rank : 'IV';
  const pointsA = a.rank && a.rank.length > 0 ? a.rank[0].leaguePoints : 0;
  const pointsB = a.rank && a.rank.length > 0 ? a.rank[0].leaguePoints : 0;

  console.log(`Comparing ${a.account.gameName} (${tierA} ${rankA}, LP: ${pointsA}) with ${b.account.gameName} (${tierB} ${rankB}, LP: ${pointsB})`);

  if (elo(tierA) !== elo(tierB)) {
    console.log(`Different tiers: ${tierA} vs ${tierB}, result: ${elo(tierB) - elo(tierA)}`);
    return elo(tierB) - elo(tierA);
  } else if (tier(rankA) !== tier(rankB)) {
    console.log(`Same tier but different divisions: ${rankA} vs ${rankB}, result: ${tier(rankB) - tier(rankA)}`);
    return tier(rankB) - tier(rankA);
  } else {
    console.log(`Same tier and division, comparing league points: ${pointsA} vs ${pointsB}, result: ${pointsB - pointsA}`);
    return pointsB - pointsA;
  }
};

// Lista de jogadores
const players = [
  { gameName: 'BRP FATE', tagLine: 'BR1' },
  { gameName: 'BRP VITOR', tagLine: 'BR1' },
  { gameName: 'ColdFear', tagLine: 'xqdl' },
  { gameName: 'BRP BRENIN', tagLine: 'BR1' },
  { gameName: 'BRP DINHO', tagLine: 'BR1' },
  { gameName: 'BLACKZInn', tagLine: '997' },
  { gameName: 'Snake', tagLine: '06033' },
  { gameName: 'RiteZ', tagLine: 'BR1' },
  { gameName: 'Stalo', tagLine: 'STALO' },
  { gameName: 'BRP Oghati', tagLine: 'BR1' }
];

const App = () => {
  const [playersData, setPlayersData] = useState([]);

  useEffect(() => {
    const getPlayersData = async () => {
      const allPlayersData = await Promise.all(players.map(async (player) => {
        const account = await fetchPUUID(player.gameName, player.tagLine);
        if (!account) return null;

        const summoner = await fetchSummonerByPUUID(account.puuid);
        if (!summoner) return null;

        const rankData = await fetchRankData(summoner.id);
        console.log('Rank data:', rankData);
        if (!Array.isArray(rankData)) {
          console.error('rankData is not an array:', rankData);
          return null;
        }

        const rank = rankData.find(r => r.queueType === 'RANKED_SOLO_5x5') || rankData[0];
        return {
          ...player,
          account,
          summoner,
          rank: [rank]
        };
      }));
      const filteredPlayersData = allPlayersData.filter(data => data !== null);
      const sortedPlayersData = filteredPlayersData.sort(comparePlayers);
      setPlayersData(sortedPlayersData);
    };

    getPlayersData();
  }, []);

  return (
    <div className="App">
      <Header />
      <div className="players-container">
        {playersData.map((playerData, index) => (
          <RankCard 
            key={index}
            summonerData={playerData.summoner} 
            rankData={playerData.rank} 
            accountData={playerData.account} 
            isFirst={index === 0} // Passa a prop isFirst para o RankCard
          />
        ))}
      </div>
    </div>
  );
};

export default App;
