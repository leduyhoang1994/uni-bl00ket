import { ButtonHTMLAttributes } from "react";

export default function UniButton({
  text = "",
  color = "var(--purple)",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  text?: string;
  color?: string;
}) {
  props.className += " uni-button";
  return (
    <button type="button" className="uni-button" {...props}>
      <div
        className="uni-button__back"
        style={{ backgroundColor: color }}
      ></div>
      <div className="uni-button__front" style={{ backgroundColor: color }}>
        <span className="uni-button__content">
          <div className="uni-button__text">{text}</div>
        </span>
      </div>
    </button>
  );
}
