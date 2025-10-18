export default function GoldQuestHeader({ gold = 0 }) {
  return (
    <header className="gold-quest__header">
      <div className="change-to-period">name</div>
      <div>
        <div>{gold}</div>
        <img src="/images/gold-quest/gold.svg" alt="gold" />
      </div>
    </header>
  )
}