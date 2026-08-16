import { useTheme } from '../../context/ThemeContext';

const ThemeToggle = ({ className = '' }) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      className={`inline-flex h-10 w-10 items-center justify-center rounded-full border border-ui-line bg-ui-card text-ui-ink transition hover:bg-ui-card2 ${className}`}
    >
      <i className={`${isDark ? 'ri-sun-line' : 'ri-moon-line'} text-lg`} />
    </button>
  );
};

export default ThemeToggle;
