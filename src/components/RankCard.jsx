// src/components/RankCard.js

import React, { useState } from 'react';
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
import trollImage from '../assets/images/Troll.png';
import firstPlayerImage from '../assets/images/Ashe_0.jpg';

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

const RankCard = ({ summonerData, rankData, accountData, isFirst }) => {
  const [showTrollImage, setShowTrollImage] = useState(false);

  const soloRank = rankData.find(entry => entry.queueType === "RANKED_SOLO_5x5") || { tier: '', rank: '', leaguePoints: 0, wins: 0, losses: 0 };

  const handleCardClick = () => {
    setShowTrollImage(!showTrollImage);
  };

  return (
    <div className="rank-card" onClick={handleCardClick}>
      {isFirst && (
        <img src={firstPlayerImage} alt="First Player" className="first-player-image" />
      )}
      <img src={tierImages[soloRank.tier] || tierImages['IRON']} alt={`${soloRank.tier} Emblem`} />
      <div className="rank-info">
        <h2>{accountData.gameName}#{accountData.tagLine}</h2>
        <p>Level: {summonerData.summonerLevel}</p>
        <p>Rank: {soloRank.tier} {soloRank.rank}</p>
      </div>
      <div className="rank-stats">
        <p>LP: {soloRank.leaguePoints}</p>
        <p>Wins: {soloRank.wins}</p>
        <p>Losses: {soloRank.losses}</p>
      </div>
      {showTrollImage && (
        <div className="troll-info">
          <img src={trollImage} alt="TROLL 1" />
        </div>
      )}
    </div>
  );
};

export default RankCard;
