import { useEffect, useRef, useState } from 'react';
import Skeleton from './ui/Skeleton';

// Split a place label like "Central Station, Mumbai, MH" into a name + secondary address
const splitLabel = (label) => {
  const idx = label.indexOf(',');
  if (idx > 0) return [label.slice(0, idx).trim(), label.slice(idx + 1).trim()];
  return [label, ''];
};

const LocationSearchPanel = ({
  suggestions = [],
  loading = false,
  onSelect,
  recent = [],
  onSelectRecent,
  onClearRecent,
  emptyText = 'No matches found. Try a different search.',
}) => {
  const [activeIndex, setActiveIndex] = useState(-1);
  const listRef = useRef(null);

  // Reset highlight when the list changes
  useEffect(() => setActiveIndex(-1), [suggestions, loading, recent]);

  const handleKeyDown = (e) => {
    if (!suggestions.length) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % suggestions.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => (i - 1 + suggestions.length) % suggestions.length);
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault();
      onSelect?.(suggestions[activeIndex]);
    }
  };

  const showRecent = !loading && suggestions.length === 0 && recent.length > 0;

  const renderRow = (icon, name, secondary, onClick, idx, key) => (
    <button
      key={key}
      type="button"
      role="option"
      aria-selected={idx === activeIndex}
      onClick={onClick}
      onMouseEnter={() => setActiveIndex(idx)}
      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition ${
        idx === activeIndex ? 'bg-ui-card2' : 'hover:bg-ui-card2'
      }`}
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-ui-line bg-ui-card text-ui-muted">
        <i className={icon} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium text-ui-ink">{name}</span>
        {secondary && <span className="block truncate text-xs text-ui-faint">{secondary}</span>}
      </span>
    </button>
  );

  return (
    <div
      ref={listRef}
      onKeyDown={handleKeyDown}
      className="max-h-72 space-y-1 overflow-y-auto"
      role="listbox"
      aria-label="Location suggestions"
    >
      {loading && (
        <div className="space-y-2 p-1" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex items-center gap-3 rounded-xl px-3 py-3">
              <Skeleton className="h-9 w-9 rounded-full" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-3.5 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Recent locations (shown when the input is focused and empty) */}
      {showRecent && (
        <div className="space-y-0.5">
          <div className="flex items-center justify-between px-3 pb-1 pt-1">
            <span className="text-[11px] font-bold uppercase tracking-wide text-ui-faint">Recent</span>
            <button
              type="button"
              onClick={onClearRecent}
              className="text-xs font-semibold text-ui-faint transition hover:text-ui-ink"
            >
              Clear all
            </button>
          </div>
          {recent.map((place, idx) => {
            const [name, secondary] = splitLabel(place);
            return renderRow('ri-time-line', name, secondary, () => onSelectRecent?.(place), idx, `recent-${place}-${idx}`);
          })}
        </div>
      )}

      {!loading && suggestions.length === 0 && !showRecent && (
        <div className="flex flex-col items-center gap-2 px-4 py-8 text-center">
          <i className="ri-search-line text-2xl text-ui-faint" />
          <p className="text-sm text-ui-muted">{emptyText}</p>
        </div>
      )}

      {!loading &&
        suggestions.map((suggestion, idx) => {
          const [name, secondary] = splitLabel(suggestion);
          return renderRow(
            'ri-map-pin-2-line',
            name,
            secondary,
            () => onSelect?.(suggestion),
            idx,
            `suggestion-${suggestion}-${idx}`
          );
        })}
    </div>
  );
};

export default LocationSearchPanel;
