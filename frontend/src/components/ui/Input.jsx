export const inputStyles = (hasError) =>
  `w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-ink-900 placeholder:text-ink-400 transition-colors focus:outline-none focus:ring-2 ${
    hasError
      ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
      : 'border-ink-200 hover:border-ink-300 focus:border-brand-500 focus:ring-brand-100'
  }`;

const Input = ({ label, error, hint, className = '', id, ...rest }) => {
  const inputId = id || rest.name || label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className={className}>
      {label && (
        <label htmlFor={inputId} className="mb-1.5 block text-sm font-semibold text-ink-800">
          {label}
        </label>
      )}
      <input id={inputId} className={inputStyles(!!error)} aria-invalid={!!error} {...rest} />
      {error && (
        <p className="mt-1.5 text-xs font-medium text-red-600" role="alert">
          {error}
        </p>
      )}
      {!error && hint && <p className="mt-1.5 text-xs text-ink-400">{hint}</p>}
    </div>
  );
};

export default Input;
