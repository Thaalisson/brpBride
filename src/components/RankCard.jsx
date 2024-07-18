import React, { useState, useEffect } from 'react';
import ironImage from '../assets/images/Emblem_Iron.png';
import bronzeImage from '../assets/images/Emblem_Bronze.png';
import silverImage from '../assets/images/Emblem_Silver.png';
import goldImage from '../assets/images/Emblem_Gold.png';
import platinumImage from '../assets/images/Emblem_Platinum.png';
import emeraldImage from '../assets/images/Emblem_Emerald.png';
import diamondImage from '../assets/images/Emblem_Diamond.png';
import masterImage from '../assets/images/Emblem_Master.png';
import grandmasterImage from '../assets/images/Emblem_Grandmaster.png';
import challengerImage from '../assets/images/Emblem_Challenger.png';
import trophyImage from '../assets/images/Trophy.png';
import trophySilverImage from '../assets/images/Silver.png';
import trophyBronzeImage from '../assets/images/Bronze.png';
import { fetchActiveGame, fetchChampionMastery } from '../api/leagueAPI';
import '../styles/RankCard.css';

const tierImages = {
  IRON: ironImage,
  BRONZE: bronzeImage,
  SILVER: silverImage,
  GOLD: goldImage,
  PLATINUM: platinumImage,
  EMERALD: emeraldImage,
  DIAMOND: diamondImage,
  MASTER: masterImage,
  GRANDMASTER: grandmasterImage,
  CHALLENGER: challengerImage,
  UNRANKED: bronzeImage
};

const getChampionImageUrl = (championName) => `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${championName}_0.jpg`;

const RankCard = ({ summonerData, rankData, accountData, isFirst, translations, position }) => {
  const [activeGame, setActiveGame] = useState(false);
  const [mainChampion, setMainChampion] = useState(null);
  const [championData, setChampionData] = useState({});

  const soloRank = rankData.find(entry => entry.queueType === "RANKED_SOLO_5x5") || { tier: '', rank: '', leaguePoints: 0, wins: 0, losses: 0 };

  useEffect(() => {
    const fetchChampionData = async () => {
      try {
        const response = await fetch('https://ddragon.leagueoflegends.com/cdn/12.18.1/data/en_US/champion.json');
        const data = await response.json();
        const championMap = {};
        Object.values(data.data).forEach(champion => {
          championMap[champion.key] = champion.id;
        });
        setChampionData(championMap);
      } catch (error) {
        console.error('Error fetching champion data:', error);
      }
    };

    fetchChampionData();
  }, []);

  useEffect(() => {
    const fetchGameAndMastery = async () => {
      const gameData = await fetchActiveGame(accountData.puuid);
      setActiveGame(!!gameData);

      const masteryData = await fetchChampionMastery(accountData.puuid);
      if (masteryData && masteryData.length > 0) {
        setMainChampion(masteryData[0].championId);
      }
    };

    fetchGameAndMastery();
  }, [accountData.puuid]);

  const tierTranslation = (tier) => {
    switch (tier) {
      case 'IRON':
        return translations.iron;
      case 'BRONZE':
        return translations.bronze;
      case 'SILVER':
        return translations.silver;
      case 'GOLD':
        return translations.gold;
      case 'PLATINUM':
        return translations.platinum;
      case 'EMERALD':
        return translations.emerald;
      case 'DIAMOND':
        return translations.diamond;
      case 'MASTER':
        return translations.master;
      case 'GRANDMASTER':
        return translations.grandmaster;
      case 'CHALLENGER':
        return translations.challenger;
      default:
        return tier;
    }
  };

  const opggUrl = `https://www.op.gg/summoners/br/${encodeURIComponent(accountData.gameName)}-${accountData.tagLine}`;

  const getTrophyImage = () => {
    switch (position) {
      case 1:
        return trophyImage;
      case 2:
        return trophySilverImage;
      case 3:
        return trophyBronzeImage;
      default:
        return null;
    }
  };

  return (
    <div 
      className={`rank-card ${isFirst ? 'first' : ''}`}
    >
      {mainChampion && championData[mainChampion] && (
        <div 
          className="rank-card-background" 
          style={{ backgroundImage: `url(${getChampionImageUrl(championData[mainChampion])})` }}
        />
      )}
      <div className="rank-position">
        {getTrophyImage() && <img src={getTrophyImage()} alt="Trophy" className="trophy-image" />}
        <span className="position-number">{position}</span>
      </div>
      <img src={tierImages[soloRank.tier] || tierImages['IRON']} alt={`${soloRank.tier} Emblem`} />
      <div className="rank-info">
        <h2>{accountData.gameName}#{accountData.tagLine}</h2>
        <p>{translations.level}: {summonerData.summonerLevel}</p>
        <p>{translations.rank}: {tierTranslation(soloRank.tier)} {soloRank.rank}</p>
        {activeGame && <p className="active-game-text">{translations.live}</p>}
      </div>
      <div className="rank-stats">
        <p>{translations.lp}: {soloRank.leaguePoints}</p>
        <p>{translations.wins}: {soloRank.wins}</p>
        <p>{translations.losses}: {soloRank.losses}</p>
        <a href={opggUrl} target="_blank" rel="noopener noreferrer" className="opgg-button">Ver no OP.GG</a>
      </div>
    </div>
  );
};

export default RankCard;
