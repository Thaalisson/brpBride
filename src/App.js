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
  'CHALLENGER', 'GRANDMASTER', 'MASTER',
  'DIAMOND', 'EMERALD', 'PLATINUM', 'GOLD', 
  'SILVER', 'BRONZE', 'IRON', 'UNRANKED'
];

const divisionOrder = {
  'I': 4,
  'II': 3,
  'III': 2,
  'IV': 1,
  'UNRANKED': 0
};

const comparePlayers = (a, b) => {
  const tierA = a.rank && a.rank.length > 0 ? a.rank[0].tier : 'UNRANKED';
  const tierB = b.rank && b.rank.length > 0 ? b.rank[0].tier : 'UNRANKED';
  
  const eloA = tierOrder.indexOf(tierA);
  const eloB = tierOrder.indexOf(tierB);

  if (eloA !== eloB) {
    return eloB - eloA;
  }

  const divisionA = a.rank && a.rank.length > 0 ? divisionOrder[a.rank[0].rank] : 0;
  const divisionB = b.rank && b.rank.length > 0 ? divisionOrder[b.rank[0].rank] : 0;

  if (divisionA !== divisionB) {
    return divisionB - divisionA;
  }

  const pointsA = a.rank && a.rank.length > 0 ? a.rank[0].leaguePoints : 0;
  const pointsB = b.rank && b.rank.length > 0 ? b.rank[0].leaguePoints : 0;

  return pointsB - pointsA;
};

const App = () => {
  const [playersData, setPlayersData] = useState([]);

  useEffect(() => {
    const getPlayersData = async () => {
      const allPlayersData = await Promise.all(players.map(async (player) => {
        const account = await fetchPUUID(player.gameName, player.tagLine);
        if (!account) return null;

        const summoner = await fetchSummonerByPUUID(account.puuid, 'br1');
        if (!summoner) return null;

        const rank = await fetchRankData(summoner.id, 'br1');
        return {
          account,
          summoner,
          rank: Array.isArray(rank) ? rank : []
        };
      }));

      const validPlayersData = allPlayersData.filter(data => data !== null);
      validPlayersData.sort(comparePlayers);
      setPlayersData(validPlayersData);
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
