export default function ButtonCafeGame({
  text = 'Trả lời câu hỏi',
  doClickBtn = () => { }
}) {
  return (
    <button className="cafe-game__button" onPointerUp={doClickBtn}>
      <div>{text}</div>
    </button>
  )
}