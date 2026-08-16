export const inputStyles = (hasError) =>
  `w-full rounded-xl border bg-ui-card px-4 py-2.5 text-sm text-ui-ink placeholder:text-ui-faint transition-colors focus:outline-none focus:ring-2 ${
    hasError
      ? 'border-red-500/60 focus:border-red-500 focus:ring-red-500/15'
      : 'border-ui-line hover:border-ui-faint focus:border-ui-ink focus:ring-ui-ink/10'
  }`;

const Input = ({ label, error, hint, className = '', id, ...rest }) => {
  const inputId = id || rest.name || label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className={className}>
      {label && (
        <label htmlFor={inputId} className="mb-1.5 block text-sm font-semibold text-ui-ink">
          {label}
        </label>
      )}
      <input id={inputId} className={inputStyles(!!error)} aria-invalid={!!error} {...rest} />
      {error && (
        <p className="mt-1.5 text-xs font-medium text-red-500" role="alert">
          {error}
        </p>
      )}
      {!error && hint && <p className="mt-1.5 text-xs text-ui-faint">{hint}</p>}
    </div>
  );
};

export default Input;
