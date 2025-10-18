export default function GoldQuestInfoUser({ userName = 'a', gold = 10 }) {
  return (
    <article className="gold-quest__content-other-user">
      <div className="gold-quest__info-other-user">
        <figure className="gold-quest__info-other-user-figure">
          <img src="/images/cafe-game/customers/jester.svg" alt="other user avatar" />
          <figcaption>
            <div className="gold-quest__other-user-name">{userName}</div>
            <div className="gold-quest__total-gold">
              <span>{gold}</span>
              <img src="/images/gold-quest/gold.svg" alt="gold reward" />
            </div>
          </figcaption>
        </figure>
      </div>
    </article>
  )
}