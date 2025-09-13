export default function ButtonHost({ textBtn = '1 More', hasPlayer = false }) {

  const doClickBtn = () => {
    if (!hasPlayer) {
      return;
    }
    console.log('doClickBtn');

  }

  return (
    <button
      style={{ cursor: hasPlayer ? 'pointer' : 'auto' }}
      className="button-host"
      onClick={doClickBtn}
    >{textBtn}</button>
  )
}