import { HostLeaderboardItem } from '@common/types/host.type';
import React from 'react';

export enum FinalStandingsPrizeRank {
  FIRST = 'FIRST',
  SECOND = 'SECOND',
  THIRD = 'THIRD'
}

type RankDetails = {
  columnClass: string;
  ribbonClass: string;
  textSuffix: string;
  rankNumber: number;
  stateImg?: string
};

const RANK_CONFIG: Record<FinalStandingsPrizeRank, RankDetails> = {
  [FinalStandingsPrizeRank.FIRST]: {
    columnClass: 'final-standings-prize__first-prize',
    ribbonClass: 'final-standings-prize__first-prize-ribbon',
    textSuffix: 'st',
    rankNumber: 1,
    stateImg: '/images/background-avatar/gold-prize.svg',
  },
  [FinalStandingsPrizeRank.SECOND]: {
    columnClass: 'final-standings-prize__second-prize',
    ribbonClass: 'final-standings-prize__second-prize-ribbon',
    textSuffix: 'nd',
    rankNumber: 2,
    stateImg: '/images/background-avatar/silver-prize.svg',
  },
  [FinalStandingsPrizeRank.THIRD]: {
    columnClass: 'final-standings-prize__third-prize',
    ribbonClass: 'final-standings-prize__third-prize-ribbon',
    textSuffix: 'rd',
    rankNumber: 3,
    stateImg: '/images/background-avatar/bronze-prize.svg',
  },
};

interface FinalStandingsPrizeProps {
  useRank?: FinalStandingsPrizeRank;
  leaderboardItem: HostLeaderboardItem;
}

export default function FinalStandingsPrize({
  leaderboardItem,
  useRank = FinalStandingsPrizeRank.FIRST,
}: FinalStandingsPrizeProps) {
  const rankInfo = RANK_CONFIG[useRank];
  const userName = leaderboardItem.username;
  const score = leaderboardItem.score;

  return (
    <div className={`final-standings-prize ${rankInfo.columnClass}`}>
      <div className={`final-standings-prize__ground`}></div>
      <div className="final-standings-prize__avatar">
        <img src={leaderboardItem.avatar} alt={`${userName}'s avatar`} />
      </div>
      <div className={`final-standings-prize__ribbon ${rankInfo.ribbonClass}`}>
        <div className="final-standings-prize__ribbon-content">
          <div className="change-to-period">{userName}</div>
        </div>
      </div>
      <div className="final-standings-prize__score">
        <div className="change-to-period">Score: {score}</div>
      </div>
      <div className="final-standings-prize__rank">
        {rankInfo.rankNumber} <span>{rankInfo.textSuffix}</span>
      </div>
    </div>
  );
}