import React from 'react';

const TftCard = ({ accountData, tftSummoner, rankData, translations, position }) => {
  const entry = rankData.find((item) => item.queueType === 'RANKED_TFT') || rankData[0] || null;
  const tierLabel = entry ? `${entry.tier} ${entry.rank}` : translations.rank;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-950/60 p-5 shadow-lg backdrop-blur md:p-6">
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/60 to-slate-950/90" />
      <div className="relative z-10 grid gap-4 md:grid-cols-[auto_1fr_auto] md:items-center">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-lg font-display text-white">
            {position}
          </div>
          <div>
            <h2 className="text-lg font-display text-white md:text-xl">
              {accountData.gameName}#{accountData.tagLine}
            </h2>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">TFT</p>
          </div>
        </div>
        <div className="space-y-2 text-sm text-slate-300">
          <p>{translations.level}: {tftSummoner?.summonerLevel ?? '--'}</p>
          <p>{translations.rank}: {entry ? tierLabel : '--'}</p>
        </div>
        <div className="flex flex-col items-start gap-3 text-sm text-slate-200 md:items-end">
          <div className="flex flex-wrap gap-4 text-xs text-slate-300">
            <span><span className="text-slate-500">{translations.lp}</span> {entry?.leaguePoints ?? '--'}</span>
            <span><span className="text-slate-500">{translations.wins}</span> {entry?.wins ?? '--'}</span>
            <span><span className="text-slate-500">{translations.losses}</span> {entry?.losses ?? '--'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TftCard;
