import React from 'react';

const calculateProgress = (endDate) => {
  const startDate = new Date();
  const end = new Date(endDate);
  const total = end - new Date('2024-01-01');
  const passed = startDate - new Date('2024-01-01');
  return Math.min((passed / total) * 100, 100);
};

const Prize = ({ topPlayers, translations }) => {
  const progress = calculateProgress('2024-10-31');

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-6 shadow-lg backdrop-blur md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-3xl font-display text-white md:text-4xl">{translations.prizeTitle}</h2>
            <p className="mt-2 text-sm text-slate-300 md:text-base">{translations.prizeSubtitle}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-xs uppercase tracking-[0.35em] text-slate-300">
            {translations.endDate}
          </div>
        </div>
        <p className="mt-6 text-sm text-slate-300 md:text-base">{translations.prizeExplanation}</p>
        <div className="mt-6">
          <h3 className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">
            {translations.tiebreakerTitle}
          </h3>
          <ol className="mt-3 grid gap-2 text-sm text-slate-300 md:grid-cols-2">
            {translations.tiebreakerRules.map((rule, index) => (
              <li key={index} className="rounded-xl border border-white/5 bg-white/5 px-3 py-2">
                {index + 1}. {rule}
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-6 shadow-lg backdrop-blur md:p-8">
        <div className="grid gap-4 md:grid-cols-3">
          {topPlayers.slice(0, 3).map((player, index) => (
            <div
              key={index}
              className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center text-sm text-slate-200"
            >
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">#{index + 1}</p>
              <h3 className="mt-2 text-lg font-display text-white">
                {player.account.gameName}#{player.account.tagLine}
              </h3>
              <p className="mt-2 text-sm text-slate-300">
                {player.rank[0].tier} {player.rank[0].rank}
              </p>
              <p className="mt-1 text-xs text-slate-400">
                {translations.lp}: {player.rank[0].leaguePoints}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>0%</span>
            <span>100%</span>
          </div>
          <div className="mt-2 h-3 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-[linear-gradient(90deg,#62d4ff,#f9c74f)]"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-2 text-right text-xs text-slate-400">{progress.toFixed(2)}%</p>
        </div>
      </div>
    </div>
  );
};

export default Prize;
