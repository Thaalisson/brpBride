// src/App.js

import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import RankCard from './components/RankCard';
import { fetchPUUID, fetchSummonerByPUUID, fetchRankData } from './api/leagueAPI';
import './styles/App.css';

const players = [
  { gameName: 'BRP FATE', tagLine: 'BR1' },
  { gameName: 'BRP VITOR', tagLine: 'BR1' },
  { gameName: 'BRP BRENIN', tagLine: 'BR1' },
  { gameName: 'BRP DINHO', tagLine: 'BR1' },
  { gameName: 'BLACKZInn', tagLine: '997' },
  { gameName: 'Snake', tagLine: '06033' },
  { gameName: 'RiteZ', tagLine: 'BR1' },
  { gameName: 'Stalo', tagLine: 'STALO' },
  { gameName: 'BRP Oghati', tagLine: 'BR1' }
];

const tierOrder = [
  'EMERALD','CHALLENGER', 'GRANDMASTER', 'MASTER',
  'DIAMOND', 'PLATINUM', 'GOLD', 
  'SILVER', 'BRONZE', 'IRON', 'UNRANKED'
];

const divisionOrder = {
  'I': 1,
  'II': 2,
  'III': 3,
  'IV': 4
};

const comparePlayers = (a, b) => {
  const isSnakeOrRiteZ = player => player.account.gameName === 'Snake' || player.account.gameName === 'RiteZ';
  
  if (isSnakeOrRiteZ(a) && isSnakeOrRiteZ(b)) {
    return 0; // If both are 'Snake' or 'RiteZ', consider them equal
  } else if (isSnakeOrRiteZ(a)) {
    return 1; // 'Snake' or 'RiteZ' should come after any other player
  } else if (isSnakeOrRiteZ(b)) {
    return -1; // Any other player should come before 'Snake' or 'RiteZ'
  }

  const tierA = a.rank && a.rank.length > 0 ? a.rank[0].tier : 'UNRANKED';
  const tierB = b.rank && b.rank.length > 0 ? b.rank[0].tier : 'UNRANKED';

  const indexA = tierOrder.indexOf(tierA);
  const indexB = tierOrder.indexOf(tierB);

  if (indexA !== indexB) {
    return indexA - indexB;
  } else if (tierA !== 'UNRANKED' && tierB !== 'UNRANKED') {
    const divisionA = divisionOrder[a.rank[0].rank];
    const divisionB = divisionOrder[b.rank[0].rank];
    if (divisionA !== divisionB) {
      return divisionA - divisionB;
    } else {
      return b.rank[0].leaguePoints - a.rank[0].leaguePoints;
    }
  } else {
    return 0;
  }
};

const App = () => {
  const [playersData, setPlayersData] = useState([]);

  useEffect(() => {
    const getPlayersData = async () => {
      const allPlayersData = await Promise.all(players.map(async (player) => {
        const account = await fetchPUUID(player.gameName, player.tagLine);
        if (!account) return null;

        const summoner = await fetchSummonerByPUUID(account.puuid);
        if (!summoner) return null;

        const rank = await fetchRankData(summoner.id);
        if (!rank) return null;

        return {
          account,
          summoner,
          rank
        };
      }));
      const filteredPlayersData = allPlayersData.filter(data => data !== null);
      filteredPlayersData.sort(comparePlayers);
      setPlayersData(filteredPlayersData);
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
          />
        ))}
      </div>
    </div>
  );
};

export default App;
