export default function PopupCopyLink({ setTogglePopup = (value: boolean) => { } }) {
  return (
    <div className="popup-copy-link" onClick={() => setTogglePopup(false)}>
      <div className="popup-copy-link__container">
        <div className="popup-copy-link__container-content">
          URL Copied
        </div>
      </div>
    </div>
  )
}