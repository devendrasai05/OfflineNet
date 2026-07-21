import "./Button.css";

function Button({
  children,
  variant = "primary",
  size = "medium",
  type = "button",
  disabled = false,
  onClick,
}) {
  const className = [
  "button",
  `button--${variant}`,
  `button--${size}`,
]
  .filter(Boolean)
  .join(" ");

  return (
    <button
      type={type}
      className={className}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default Button;