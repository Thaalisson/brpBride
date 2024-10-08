import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import RankCard from './components/RankCard';
import Prize from './components/Prize';
import { fetchPUUID, fetchSummonerByPUUID, fetchRankData } from './api/leagueAPI';
import en from './i18n/en';
import pt from './i18n/pt';
import './styles/App.css';
import Footer from './components/Footer';

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
      return -1;
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
  } else if (tier(rankA) !== tier(rankB)) {
    return tier(rankB) - tier(rankA);
  } else {
    return pointsB - pointsA;
  }
};

const players = [
  { gameName: 'BRP VITOR', tagLine: 'BR1' },
  { gameName: 'BRP FATE', tagLine: 'BR1' },
  { gameName: 'ColdFear', tagLine: '6015' },
  { gameName: 'BRP BRENIN', tagLine: 'BR1' },
  { gameName: 'BRP DINHO', tagLine: 'BR1' },
  { gameName: 'BLACKZInn', tagLine: '997' },
  { gameName: 'Snake', tagLine: '06033' },
  { gameName: 'RiteZ', tagLine: 'BR1' },
  { gameName: 'Stalo', tagLine: 'STALO' },
  { gameName: 'Franscoviaki', tagLine: 'BR1' },
  { gameName: 'BRP Oghati', tagLine: 'BR1' }
];

const App = () => {
  const [playersData, setPlayersData] = useState([]);
  const [language, setLanguage] = useState('en');
  const translations = language === 'en' ? en : pt;

  useEffect(() => {
 const getPlayersData = async () => {
  const allPlayersData = await Promise.all(players.map(async (player) => {
    const account = await fetchPUUID(player.gameName, player.tagLine);
    if (!account) return null;

    const summoner = await fetchSummonerByPUUID(account.puuid);
    if (!summoner) return null;

    const rankData = await fetchRankData(summoner.id);
    if (!rankData || rankData.length === 0) return { ...player, account, summoner, rank: [{ tier: 'UNRANKED', rank: 'IV', leaguePoints: 0 }] };

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

  const toggleLanguage = () => {
    setLanguage((prevLanguage) => (prevLanguage === 'en' ? 'pt' : 'en'));
  };

  return (
    <Router>
      <div className="App">
        <Header />
        <div className="language-toggle-container">
          <label className="language-label">{language === 'en' ? 'EN' : 'PT'}</label>
          <label className="switch">
            <input type="checkbox" checked={language === 'en'} onChange={toggleLanguage} />
            <span className="slider"></span>
          </label>
        </div>
        <Routes>
          <Route exact path="/" element={
            <div className="players-container">
              {playersData.map((playerData, index) => (
                <RankCard
                  key={index}
                  summonerData={playerData.summoner}
                  rankData={playerData.rank}
                  accountData={playerData.account}
                  isFirst={index === 0}
                  translations={translations}
                  position={index + 1} // Passar a posição
                />
              ))}
            </div>
          }/>
           <Route path="/prize" element={<Prize topPlayers={playersData} translations={translations} />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
