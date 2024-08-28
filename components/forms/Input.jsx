const Input = ({ label, type = 'text', name, value, placeholder, onChange, isSubmitted, errorMessage, required }) => {
  return (
    <div className="flex flex-col">
      <label htmlFor={name} className="flex gap-1 mt-2 mb-2 text-primary font-semibold">
        <span>{label}</span>
        {required && <span className="text-title-active-static">*</span>}
      </label>

      <input
        type={type}
        id={name}
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        className={`w-full rounded-[5px] p-1 h-[35px] text-black focus-visible:outline-none border-2 ${isSubmitted && !value
          ? "border-red-500"
          : "border-transparent focus:border-primary"
        }`}
        style={{ marginBottom: '2px' }}
      />

      {(isSubmitted && !value) || errorMessage ? (
        <span className="text-delete-link-active mt-2 font-semibold">{errorMessage}</span>
      ) : null}
    </div>
  );
};

export default Input;
