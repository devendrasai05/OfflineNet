import Input from "../Input";
import "./FormField.css";

function FormField({
  label,
  id,
  type = "text",
  placeholder,
  value,
  onChange,
  disabled = false,
  error = "",
}) {
  return (
    <div className="form-field">
      <label htmlFor={id}>{label}</label>

      <Input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
      />

      {error && (
        <p className="form-field-error">
          {error}
        </p>
      )}
    </div>
  );
}

export default FormField;