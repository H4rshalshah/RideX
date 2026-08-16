import Spinner from './Spinner';

const variants = {
  primary: 'bg-ui-accent text-ui-onaccent hover:opacity-90 active:opacity-80 disabled:hover:opacity-100',
  dark: 'bg-ui-accent text-ui-onaccent hover:opacity-90 active:opacity-80 disabled:hover:opacity-100',
  secondary: 'bg-ui-card2 text-ui-ink hover:bg-ui-line active:opacity-80 disabled:hover:bg-ui-card2',
  ghost: 'bg-transparent text-ui-ink hover:bg-ui-card2 active:opacity-80',
  light: 'bg-ui-card text-ui-ink hover:opacity-90 active:opacity-80 disabled:hover:opacity-100',
  inverse: 'border border-ui-onaccent/40 bg-transparent text-ui-onaccent hover:bg-ui-onaccent/10 active:opacity-80',
  danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 disabled:hover:bg-red-600',
};

const sizes = {
  sm: 'px-3.5 py-2 text-sm',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-6 py-3.5 text-base',
};

const Button = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  children,
  ...rest
}) => (
  <button
    className={`inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ui-ink ${variants[variant]} ${sizes[size]} ${className}`}
    disabled={disabled || loading}
    {...rest}
  >
    {loading && <Spinner className="h-4 w-4" />}
    {children}
  </button>
);

export default Button;
