export default function PopupCopyLink({ setTogglePopup = (value: boolean) => { } }) {
  return (
    <div className="popup-copy-link" onClick={() => setTogglePopup(false)}>
      <div className="popup-copy-link__container">
        <div className="popup-copy-link__container-content">
          Đã sao chép đường dẫn
        </div>
      </div>
    </div>
  )
}