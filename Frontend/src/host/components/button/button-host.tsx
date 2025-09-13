export default function ButtonHost({ textBtn = '1 More', hasPlayer = false, doClickBtn = () => { } }) {


  return (
    <button
      style={{ cursor: hasPlayer ? 'pointer' : 'auto' }}
      className="button-host"
      onClick={doClickBtn}
    >{textBtn}</button>
  )
}