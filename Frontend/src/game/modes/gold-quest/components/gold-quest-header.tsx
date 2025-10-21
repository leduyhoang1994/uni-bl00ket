export default function GoldQuestHeader({ gold = 0, userName = 'a' }) {
  return (
    <header className="gold-quest__header">
      <div className="change-to-period">{userName}</div>
      <article className="gold-quest__artice-for-quiz">
        <div>{gold}</div>
        <img src="/images/gold-quest/gold.svg" alt="gold" />
      </article>
    </header>
  )
}