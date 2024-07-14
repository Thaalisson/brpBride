// src/components/Prize.jsx
import React from 'react';
import '../styles/Prize.css';

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
    <div className="prize-page">
      <h2 className="prize-title">Premiação</h2>
      <div className="prize-explanation-container">
        <p className="prize-explanation">
          O ganhador do prêmio será aquele que no final do dia 31 de outubro de 2024 ficar em primeiro colocado. 
          O primeiro lugar receberá 40 CAD, o segundo lugar receberá 10 CAD e o terceiro lugar receberá 5 CAD. 
          Será realizada uma avaliação para verificar se houve uso de Elo boosting. 
          Em caso de empate, o vencedor será determinado pelos seguintes critérios de desempate:
        </p>
        <ul className="tiebreaker-rules">
          <li>1. Maior taxa de vitórias</li>
          <li>2. Maior número de partidas jogadas</li>
          <li>3. Maior número de abates</li>
          <li>4. Menor número de mortes</li>
          <li>5. Maior número de assistências</li>
        </ul>
      </div>
      <div className="prize-container">
        <div className="top-players">
          {topPlayers.slice(0, 3).map((player, index) => (
            <div key={index} className="player-card">
              <h3>{index + 1}. {player.account.gameName}#{player.account.tagLine}</h3>
              <p>{player.rank[0].tier} {player.rank[0].rank}</p>
              <p>{translations.lp}: {player.rank[0].leaguePoints}</p>
            </div>
          ))}
        </div>
        <div className="progress-bar-container">
          <div className="progress-bar">
            <div className="progress" style={{ width: `${progress}%` }}>
              {progress.toFixed(2)}%
            </div>
          </div>
        </div>
        <p className="end-date">Data de Término: 31/10/2024</p>
      </div>
    </div>
  );
};

export default Prize;
