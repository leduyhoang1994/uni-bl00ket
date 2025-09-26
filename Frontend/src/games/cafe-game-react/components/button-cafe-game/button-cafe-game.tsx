export default function ButtonCafeGame({
  text = 'Restock Food',
  doClickBtn = () => { }
}) {
  return (
    <button className="cafe-game__button" onPointerUp={doClickBtn}>
      <div>{text}</div>
    </button>
  )
}