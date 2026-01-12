import React, { useEffect, useState } from 'react';
import { fetchPUUID, fetchTftRankData, fetchTftSummonerByPUUID } from '../api/leagueAPI';
import TftCard from './TftCard';

const TftPage = ({ players, translations }) => {
  const [playersData, setPlayersData] = useState([]);

  useEffect(() => {
    let isMounted = true;

    const getPlayersData = async () => {
      const allPlayersData = await Promise.all(players.map(async (player) => {
        const account = await fetchPUUID(player.gameName, player.tagLine);
        if (!account) return null;

        const tftSummoner = await fetchTftSummonerByPUUID(account.puuid);
        if (!tftSummoner) return null;

        const rankData = await fetchTftRankData(account.puuid);
        return {
          ...player,
          account,
          tftSummoner,
          rank: rankData
        };
      }));

      const filteredPlayersData = allPlayersData.filter((data) => data !== null);
      if (isMounted) {
        setPlayersData(filteredPlayersData);
      }
    };

    getPlayersData();

    return () => {
      isMounted = false;
    };
  }, [players]);

  return (
    <div className="grid gap-6 pb-6">
      <section className="rounded-2xl border border-white/10 bg-slate-950/60 p-5 backdrop-blur md:p-6">
        <p className="text-xs uppercase tracking-[0.4em] text-slate-400">{translations.tftTag}</p>
        <h2 className="mt-2 text-3xl font-display text-white md:text-4xl">{translations.tftTitle}</h2>
        <p className="mt-2 max-w-2xl text-sm text-slate-300 md:text-base">{translations.tftSubtitle}</p>
      </section>
      {playersData.map((playerData, index) => (
        <TftCard
          key={`${playerData.account.puuid}-${index}`}
          accountData={playerData.account}
          tftSummoner={playerData.tftSummoner}
          rankData={playerData.rank}
          translations={translations}
          position={index + 1}
        />
      ))}
    </div>
  );
};

export default TftPage;
