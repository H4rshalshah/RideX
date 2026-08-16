import { useState } from 'react';
import { inputStyles } from './Input';

const PasswordField = ({ id, label = 'Password', value, onChange, error, autoComplete = 'current-password', ...rest }) => {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-ui-ink">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={show ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          className={`${inputStyles(!!error)} pr-11`}
          aria-invalid={!!error}
          {...rest}
        />
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-ui-faint transition hover:text-ui-ink"
          aria-label={show ? 'Hide password' : 'Show password'}
          tabIndex={-1}
        >
          <i className={`${show ? 'ri-eye-off-line' : 'ri-eye-line'} text-lg`} />
        </button>
      </div>
      {error && (
        <p className="mt-1.5 text-xs font-medium text-red-500" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

export default PasswordField;
