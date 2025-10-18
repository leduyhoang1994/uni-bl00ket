export default function GoldQuestPopup({ userAvatarSteal = '', userNameSteal = 'a', gold = 0, onExits = () => { } }) {
  return (
    <dialog className="gold-quest__popup">
      <section className="gold-quest__popup-section">
        <article className="gold-quest__popup-article">
          <figure className="gold-quest__popup-message">
            <img src={userAvatarSteal} alt="user target" />
            <strong>{userNameSteal} just took {gold} gold from you!</strong>
          </figure>
          <footer className="gold-quest__popup-footer">
            <button onClick={onExits} type="button" className="gold-quest__popup-button">OK</button>
          </footer>
        </article>
      </section>
    </dialog>
  )
}