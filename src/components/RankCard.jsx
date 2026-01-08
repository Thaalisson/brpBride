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
import { fetchActiveGame, fetchChampionMastery, fetchMatchDetail, fetchMatchIds } from '../api/leagueAPI';

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

const getChampionImageUrl = (championName) => (
  `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${championName}_0.jpg`
);

const RankCard = ({ summonerData, rankData, accountData, isFirst, translations, position }) => {
  const [activeGame, setActiveGame] = useState(false);
  const [mainChampion, setMainChampion] = useState(null);
  const [championData, setChampionData] = useState({});
  const [recentStats, setRecentStats] = useState(null);

  const soloRank = rankData.find((entry) => entry.queueType === "RANKED_SOLO_5x5") || {
    tier: '',
    rank: '',
    leaguePoints: 0,
    wins: 0,
    losses: 0
  };

  useEffect(() => {
    const fetchChampionData = async () => {
      try {
        const response = await fetch('https://ddragon.leagueoflegends.com/cdn/12.18.1/data/en_US/champion.json');
        const data = await response.json();
        const championMap = {};
        Object.values(data.data).forEach((champion) => {
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

  useEffect(() => {
    let isMounted = true;

    const fetchRecentStats = async () => {
      const matchIds = await fetchMatchIds(accountData.puuid);
      if (!matchIds.length) {
        if (isMounted) {
          setRecentStats(null);
        }
        return;
      }

      const matches = await Promise.all(matchIds.map((matchId) => fetchMatchDetail(matchId)));
      const outcomes = [];
      let wins = 0;
      let kills = 0;
      let deaths = 0;
      let assists = 0;

      matches.forEach((match) => {
        const participant = match?.info?.participants?.find((entry) => entry.puuid === accountData.puuid);
        if (!participant) {
          return;
        }
        const didWin = !!participant.win;
        outcomes.push(didWin ? 'W' : 'L');
        wins += didWin ? 1 : 0;
        kills += participant.kills || 0;
        deaths += participant.deaths || 0;
        assists += participant.assists || 0;
      });

      const totalGames = outcomes.length;
      if (!totalGames) {
        if (isMounted) {
          setRecentStats(null);
        }
        return;
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

      if (isMounted) {
        setRecentStats({
          winRate,
          kda,
          streak,
          totalGames
        });
      }
    };

    fetchRecentStats();
    return () => {
      isMounted = false;
    };
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
      className={`relative overflow-hidden rounded-2xl border bg-slate-950/60 p-5 shadow-lg backdrop-blur transition md:p-6 ${isFirst ? 'border-amber-300/60 shadow-amber-500/30' : 'border-white/10'}`}
    >
      {mainChampion && championData[mainChampion] && (
        <div
          className="absolute inset-0 bg-cover bg-top opacity-30"
          style={{ backgroundImage: `url(${getChampionImageUrl(championData[mainChampion])})` }}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/60 to-slate-950/90" />
      <div className="relative z-10 grid gap-4 md:grid-cols-[auto_1fr_auto] md:items-center">
        <div className="flex items-center gap-4">
          <div className="relative">
            {getTrophyImage() && (
              <img src={getTrophyImage()} alt="Trophy" className="h-10 w-10" />
            )}
            <span className="absolute -bottom-2 -right-2 rounded-full border border-white/20 bg-slate-950/80 px-2 py-1 text-xs font-semibold text-white">
              {position}
            </span>
          </div>
          <img
            src={tierImages[soloRank.tier] || tierImages.IRON}
            alt={`${soloRank.tier} Emblem`}
            className="h-16 w-16 md:h-20 md:w-20"
          />
        </div>
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-lg font-display text-white md:text-xl">
              {accountData.gameName}#{accountData.tagLine}
            </h2>
            {activeGame && (
              <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.35em] text-emerald-200">
                {translations.live}
              </span>
            )}
          </div>
          <p className="text-sm text-slate-300">{translations.level}: {summonerData.summonerLevel}</p>
          <p className="text-sm text-slate-300">
            {translations.rank}: {tierTranslation(soloRank.tier)} {soloRank.rank}
          </p>
        </div>
        <div className="flex flex-col items-start gap-3 text-sm text-slate-200 md:items-end">
          <div className="flex flex-wrap gap-4 text-xs text-slate-300">
            <span><span className="text-slate-500">{translations.lp}</span> {soloRank.leaguePoints}</span>
            <span><span className="text-slate-500">{translations.wins}</span> {soloRank.wins}</span>
            <span><span className="text-slate-500">{translations.losses}</span> {soloRank.losses}</span>
          </div>
          <div className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-[0.7rem] uppercase tracking-[0.25em] text-slate-400 md:text-right">
            <span className="text-white">{translations.metricsTitle}</span>
            <div className="mt-2 flex flex-wrap gap-3 text-[0.65rem] text-slate-300 md:justify-end">
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                {translations.winRate}: {recentStats?.winRate === undefined ? '--' : `${recentStats.winRate}%`}
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                {translations.gamesPlayed}: {recentStats?.totalGames ?? '--'}
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                {translations.kda}: {recentStats?.kda ?? '--'}
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                {translations.streak}: {recentStats?.streak ?? '--'}
              </span>
            </div>
          </div>
          <a
            href={opggUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/10 px-4 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-white transition hover:border-white/30 hover:bg-white/20"
          >
            {translations.opgg}
          </a>
        </div>
      </div>
    </div>
  );
};

export default RankCard;

