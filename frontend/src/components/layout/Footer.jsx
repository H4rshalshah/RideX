import { Link } from 'react-router-dom';
import Logo from '../brand/Logo';

const columns = [
  {
    title: 'Product',
    links: [
      { label: 'Book a ride', to: '/home' },
      { label: 'Ride history', to: '/history' },
      { label: 'Become a captain', to: '/captain-signup' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About RideX', to: '/#about' },
      { label: 'Contact', to: '/#contact' },
      { label: 'Log in', to: '/login' },
    ],
  },
];

const socials = [
  { label: 'GitHub', icon: 'ri-github-fill', href: 'https://github.com/H4rshalshah' },
  { label: 'LinkedIn', icon: 'ri-linkedin-fill', href: 'https://www.linkedin.com/in/h4rshal/' },
  { label: 'Instagram', icon: 'ri-instagram-line', href: 'https://www.instagram.com/itz_harsh047/' },
  { label: 'Twitter / X', icon: 'ri-twitter-x-fill', href: 'https://twitter.com/h4rshalshah' },
];

const Footer = () => (
  <footer id="contact" className="border-t border-ui-line bg-ui-canvas/85 backdrop-blur-sm">
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div>
          <Logo size={30} />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-ui-muted">
            RideX is a modern ride-booking platform connecting riders with verified captains —
            quick to book, easy to track, transparent on price.
          </p>
          <div className="mt-5 flex gap-2.5">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                aria-label={s.label}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-ui-line bg-ui-card text-ui-muted transition hover:bg-ui-accent hover:text-ui-onaccent"
              >
                <i className={`${s.icon} text-lg`} />
              </a>
            ))}
          </div>
        </div>

        {columns.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <h3 className="text-sm font-bold uppercase tracking-wider text-ui-faint">{col.title}</h3>
            <ul className="mt-4 space-y-2.5">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="text-sm text-ui-muted transition hover:text-ui-ink">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}

        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-ui-faint">Contact</h3>
          <ul className="mt-4 space-y-2.5 text-sm text-ui-muted">
            <li className="flex items-center gap-2.5">
              <i className="ri-mail-line text-ui-faint" />
              <a
                href="mailto:h4rshal.workspace@gmail.com"
                className="transition hover:text-ui-ink"
              >
                h4rshal.workspace@gmail.com
              </a>
            </li>
            <li className="flex items-start gap-2.5">
              <i className="ri-map-pin-line mt-0.5 text-ui-faint" />
              <span>24/7 support across the app</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-ui-line pt-6 sm:flex-row">
        <p className="text-xs text-ui-faint">
          © {new Date().getFullYear()} RideX. All rights reserved.
        </p>
        <p className="text-xs text-ui-faint">Made with ❤️ by H4rshal</p>
      </div>
    </div>
  </footer>
);

export default Footer;
