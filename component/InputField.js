export default function InputField({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
}) {
  return (
    <div style={{ position: "relative" }}>
      <label
        style={{
          fontSize: "0.9rem",
          fontWeight: "500",
          color: "#34495e",
          marginBottom: "6px",
          display: "block",
        }}
      >
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{
          width: "100%",
          padding: "12px 14px",
          border: error ? "2px solid #e74c3c" : "1px solid #bdc3c7",
          borderRadius: "8px",
          fontSize: "1rem",
          transition: "border-color 0.2s",
          outline: "none",
        }}
      />
      {error && (
        <span
          style={{
            color: "#e74c3c",
            fontSize: "0.85rem",
            marginTop: "4px",
            display: "block",
          }}
        >
          {error}
        </span>
      )}
    </div>
  );
}
