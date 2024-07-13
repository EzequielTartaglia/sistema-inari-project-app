const TextArea = ({
  label,
  name,
  value,
  placeholder,
  onChange,
  isSubmitted,
  errorMessage,
  required,
  rows = 4,
  note
}) => {
  return (
    <div className="flex flex-col">
      <label htmlFor={name} className="flex gap-1 mt-2 mb-2 text-primary">
        <span>{label}</span>
        {required && <span className="text-title-active-static">*</span>}
      </label>

      <textarea
        id={name}
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        className={`w-full rounded-[5px] p-1 text-black focus-visible:outline-none border-2 resize-none ${
          isSubmitted && !value
            ? "border-red-500"
            : "border-transparent focus:border-primary"
        }`}
        rows={rows}
        style={{ marginBottom: "2px" }}
      />

      {isSubmitted && !value && (
        <span className="text-danger">{errorMessage}</span>
      )}

      {note && <span className="text-title-active-static text-sm mt-1">{note}</span>}
    </div>
  );
};

export default TextArea;
