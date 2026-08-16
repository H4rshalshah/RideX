const Skeleton = ({ className = 'h-4 w-full' }) => (
  <div
    aria-hidden="true"
    className={`animate-pulse rounded-lg bg-ui-card2 ${className}`}
  />
);

export default Skeleton;
