import type { HostLeaderboardItem } from "@common/types/host.type";
import { FinalStandingsPrizeRank } from "./final-standings-prize";
import { formatScore } from "@/game/common/utils/utils";

type RankDetails = {
  stateImg: string,
  orderClass: string
};

const RANK_CONFIG: Record<FinalStandingsPrizeRank, RankDetails> = {
  [FinalStandingsPrizeRank.FIRST]: {
    stateImg: '/images/background-avatar/gold-prize.svg',
    orderClass: 'final-standings__ranking-order-first',
  },
  [FinalStandingsPrizeRank.SECOND]: {
    stateImg: '/images/background-avatar/silver-prize.svg',
    orderClass: 'final-standings__ranking-order-second',
  },
  [FinalStandingsPrizeRank.THIRD]: {
    stateImg: '/images/background-avatar/bronze-prize.svg',
    orderClass: 'final-standings__ranking-order-third',
  },
};

export default function FinalStandingsPrizeV2(
  { finalStandings = [] as HostLeaderboardItem[] }: { finalStandings?: HostLeaderboardItem[] } = {}) {

  return (
    <div className="final-standings__body-cover-prize-detail">
      <div className="final-standings__ranking-wrapper">
        <img src="/images/background-avatar/back-ground-stading.svg" alt="background" className="final-standings__ranking-bg" />
        <div className="final-standings__ranking-detail">
          {finalStandings.map((item: HostLeaderboardItem, index: number) => {
            let prizeObj = RANK_CONFIG[FinalStandingsPrizeRank.FIRST]
            if (index == 1) {
              prizeObj = RANK_CONFIG[FinalStandingsPrizeRank.SECOND]
            }
            if (index == 2) {
              prizeObj = RANK_CONFIG[FinalStandingsPrizeRank.THIRD]
            }
            const userName = item.username;
            const score = formatScore(item.score);
            const avatar = item.avatar

            return (
              <div className={`final-standings__ranking-prize ${prizeObj.orderClass}`} key={index}>
                <div className="final-standings__ranking-user-avatar" >
                  <div className="change-to-period coiny-text">{userName}</div>
                  <img src={avatar || "/images/avatar/brown-dog.svg"} alt="avatar" />
                </div>
                <div className="final-standings__ranking-user-podium">
                  <img src={prizeObj.stateImg} alt="" />
                  <div className="final-standings__ranking-score">
                    <img src="/images/icons/gold-cup.svg" alt="gold cup" />
                    <div>{score}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="final-standings__body-ribbon">
        <img src="/images/icons/ribbon-standing.svg" alt="" />
      </div>
    </div>
  )
}