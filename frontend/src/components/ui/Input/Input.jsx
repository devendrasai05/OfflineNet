import "./Input.css";

function Input({
  type = "text",
  placeholder = "",
  value,
  onChange,
  disabled = false,
  name,
  id,
}) {
  return (
    <input
      className="input"
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      name={name}
      id={id}
    />
  );
}

export default Input;