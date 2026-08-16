const Skeleton = ({ className = 'h-4 w-full' }) => (
  <div
    aria-hidden="true"
    className={`animate-pulse rounded-lg bg-ink-200/70 ${className}`}
  />
);

export default Skeleton;
