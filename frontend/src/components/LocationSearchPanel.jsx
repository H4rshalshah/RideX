import { useEffect, useRef, useState } from 'react';
import Skeleton from './ui/Skeleton';

const LocationSearchPanel = ({ suggestions = [], loading = false, onSelect, emptyText = 'No matches found. Try a different search.' }) => {
  const [activeIndex, setActiveIndex] = useState(-1);
  const listRef = useRef(null);

  // Reset highlight when the list changes
  useEffect(() => setActiveIndex(-1), [suggestions, loading]);

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

      {!loading && suggestions.length === 0 && (
        <div className="flex flex-col items-center gap-2 px-4 py-8 text-center">
          <i className="ri-search-line text-2xl text-ink-300" />
          <p className="text-sm text-ink-400">{emptyText}</p>
        </div>
      )}

      {!loading &&
        suggestions.map((suggestion, idx) => (
          <button
            key={`${suggestion}-${idx}`}
            type="button"
            role="option"
            aria-selected={idx === activeIndex}
            onClick={() => onSelect?.(suggestion)}
            onMouseEnter={() => setActiveIndex(idx)}
            className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition ${
              idx === activeIndex ? 'bg-brand-50' : 'hover:bg-ink-50'
            }`}
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink-100 text-ink-500">
              <i className="ri-map-pin-2-line" />
            </span>
            <span className="min-w-0 flex-1 text-sm font-medium text-ink-800">
              {suggestion}
            </span>
          </button>
        ))}
    </div>
  );
};

export default LocationSearchPanel;
