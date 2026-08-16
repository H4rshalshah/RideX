import { useContext } from 'react';
import { CaptainDataContext } from '../context/CapatainContext';

const CaptainDetails = ({ stats }) => {
  const { captain } = useContext(CaptainDataContext);
  const vehicle = captain?.vehicle;

  const items = [
    { icon: 'ri-roadster-line', value: stats?.total ?? '—', label: 'Total trips' },
    { icon: 'ri-check-double-line', value: stats?.completed ?? '—', label: 'Completed' },
    { icon: 'ri-wallet-3-line', value: `₹${stats?.earnings ?? 0}`, label: 'Earnings' },
  ];

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-ui-accent text-lg font-extrabold text-ui-onaccent">
            {captain?.fullname?.firstname?.[0]?.toUpperCase() || 'C'}
          </span>
          <div>
            <h4 className="font-bold capitalize text-ui-ink">
              {captain?.fullname?.firstname} {captain?.fullname?.lastname}
            </h4>
            <p className="text-xs text-ui-faint">
              {vehicle ? `${vehicle.vehicleType} · ${vehicle.plate}` : 'No vehicle registered'}
            </p>
          </div>
        </div>
        <span className="rounded-xl border border-green-500/30 bg-green-500/10 px-2.5 py-1 text-xs font-bold text-green-600 dark:border-green-500/40 dark:bg-green-500/15 dark:text-green-400">
          <i className="ri-verified-badge-fill mr-1" /> Verified
        </span>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3">
        {items.map((item) => (
          <div key={item.label} className="rounded-2xl bg-ui-card2 p-3 text-center">
            <i className={`${item.icon} text-xl text-ui-ink`} />
            <p className="mt-1.5 text-lg font-extrabold text-ui-ink">{item.value}</p>
            <p className="text-[11px] font-medium text-ui-muted">{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CaptainDetails;
