
function FormField({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
  maxLength,
  helpText,
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-sm font-semibold text-[#17324D]"
      >
        {label}
        {required && (
          <span className="ml-1 text-red-500">*</span>
        )}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        maxLength={maxLength}
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-[#17324D] outline-none transition placeholder:text-slate-400 focus:border-[#2A9D8F] focus:ring-2 focus:ring-teal-100"
      />

      {helpText && (
        <p className="mt-2 text-xs leading-5 text-slate-500">
          {helpText}
        </p>
      )}
    </div>
  );
}

export default FormField;
