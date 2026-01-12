import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import RankCard from './components/RankCard';
import Prize from './components/Prize';
import TftPage from './components/TftPage';
import { fetchRankings } from './api/leagueAPI';
import en from './i18n/en';
import pt from './i18n/pt';
import Footer from './components/Footer';
import players from './data/players.json';

const App = () => {
  const [playersData, setPlayersData] = useState([]);
  const [language, setLanguage] = useState('en');
  const translations = language === 'en' ? en : pt;
  const isEnglish = language === 'en';

  useEffect(() => {
    let isMounted = true;

    const getPlayersData = async () => {
      const data = await fetchRankings();
      if (!data || !Array.isArray(data.players)) {
        return;
      }
      if (isMounted) {
        setPlayersData(data.players);
      }
    };

    getPlayersData();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <Router>
      <div className="min-h-screen">
        <div className="pointer-events-none fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(1200px_circle_at_10%_10%,rgba(98,212,255,0.18),transparent_55%),radial-gradient(900px_circle_at_90%_20%,rgba(249,199,79,0.16),transparent_50%),linear-gradient(180deg,#0b0f16_0%,#111a2b_100%)]" />
          <div className="absolute -top-24 left-10 h-64 w-64 rounded-full bg-[rgba(98,212,255,0.18)] blur-3xl" />
          <div className="absolute top-20 right-0 h-72 w-72 rounded-full bg-[rgba(249,199,79,0.16)] blur-3xl" />
          <div className="absolute bottom-0 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-[rgba(86,160,255,0.12)] blur-3xl" />
        </div>
        <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 pb-16">
          <Header translations={translations} />
          <div className="mt-6 flex flex-col gap-6">
            <section className="rounded-2xl border border-white/10 bg-slate-950/60 p-5 backdrop-blur md:p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.4em] text-slate-400">{translations.heroTag}</p>
                  <h2 className="mt-2 text-3xl font-display text-white md:text-4xl">{translations.heroTitle}</h2>
                  <p className="mt-2 max-w-2xl text-sm text-slate-300 md:text-base">{translations.heroSubtitle}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs uppercase tracking-[0.3em] text-slate-400">{translations.languageLabel}</span>
                  <div className="flex items-center rounded-full border border-white/10 bg-slate-900/70 p-1">
                    <button
                      type="button"
                      onClick={() => setLanguage('pt')}
                      className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] transition ${!isEnglish ? 'bg-white text-slate-900' : 'text-slate-300 hover:text-white'}`}
                    >
                      PT
                    </button>
                    <button
                      type="button"
                      onClick={() => setLanguage('en')}
                      className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] transition ${isEnglish ? 'bg-white text-slate-900' : 'text-slate-300 hover:text-white'}`}
                    >
                      EN
                    </button>
                  </div>
                </div>
              </div>
            </section>
            <Routes>
              <Route
                exact
                path="/"
                element={
                  <div className="grid gap-6 pb-6">
                    {playersData.map((playerData, index) => (
                      <RankCard
                        key={index}
                        summonerData={playerData.summoner}
                        rankData={playerData.rank}
                        accountData={playerData.account}
                        isFirst={index === 0}
                        translations={translations}
                        position={index + 1}
                        activeGame={playerData.activeGame}
                        mainChampionId={playerData.mainChampionId}
                        recentStats={playerData.recentStats}
                      />
                    ))}
                  </div>
                }
              />
              <Route path="/tft" element={<TftPage players={players} translations={translations} />} />
              <Route path="/prize" element={<Prize topPlayers={playersData} translations={translations} />} />
            </Routes>
          </div>
          <Footer translations={translations} />
        </div>
      </div>
    </Router>
  );
};

export default App;
