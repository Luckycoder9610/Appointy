// Small inline SVG icons used across the app
const base = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' }

export const ArrowRight = ({ className = 'w-4' }) => (
  <svg viewBox="0 0 24 24" className={className} {...base}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
)

export const ChevronDown = ({ className = 'w-3' }) => (
  <svg viewBox="0 0 24 24" className={className} {...base} strokeWidth="2.5"><path d="M6 9l6 6 6-6" /></svg>
)

export const MenuIcon = ({ className = 'w-6' }) => (
  <svg viewBox="0 0 24 24" className={className} {...base} strokeWidth="2"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
)

export const CrossIcon = ({ className = 'w-5' }) => (
  <svg viewBox="0 0 24 24" className={className} {...base} strokeWidth="2"><path d="M6 6l12 12M18 6L6 18" /></svg>
)

export const VerifiedIcon = ({ className = 'w-6' }) => (
  <svg viewBox="0 0 24 24" className={className}>
    <path fill="#1D4ED8" d="M12 1.5l2.6 1.9 3.2-.2 1 3.1 2.6 1.9-1 3.1 1 3.1-2.6 1.9-1 3.1-3.2-.2L12 22.5l-2.6-1.9-3.2.2-1-3.1-2.6-1.9 1-3.1-1-3.1 2.6-1.9 1-3.1 3.2.2z" />
    <path d="M8 12.2l2.6 2.6L16.2 9" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const InfoIcon = ({ className = 'w-4' }) => (
  <svg viewBox="0 0 24 24" className={className} {...base}><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h.01" /></svg>
)

export const UserIcon = ({ className = 'w-5' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor"><circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 4-6 8-6s8 2 8 6z" /></svg>
)

export const HomeIcon = ({ className = 'w-6' }) => (
  <svg viewBox="0 0 24 24" className={className} {...base}><rect x="3.5" y="3.5" width="17" height="17" rx="5" /><path d="M8.5 13.5q3.5 3 7 0" /></svg>
)

export const CalendarIcon = ({ className = 'w-6' }) => (
  <svg viewBox="0 0 24 24" className={className} {...base}><rect x="3.5" y="5" width="17" height="15.5" rx="3" /><path d="M3.5 10h17M8 3v4M16 3v4M8 14h.01M12 14h.01M16 14h.01M8 17h.01M12 17h.01M16 17h.01" /></svg>
)

export const AddIcon = ({ className = 'w-6' }) => (
  <svg viewBox="0 0 24 24" className={className} {...base}><rect x="3.5" y="3.5" width="17" height="17" rx="4" /><path d="M12 8v8M8 12h8" /></svg>
)

export const PeopleIcon = ({ className = 'w-6' }) => (
  <svg viewBox="0 0 24 24" className={className} {...base}><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20c0-3.5 3-6 6.5-6s6.5 2.5 6.5 6" /><circle cx="17" cy="9" r="2.5" /><path d="M17 14c2.5 0 4.5 2 4.5 5" /></svg>
)

export const ListIcon = ({ className = 'w-6' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="#5F6FFF" strokeWidth="1.8" strokeLinecap="round"><rect x="3.5" y="3.5" width="17" height="17" rx="3" /><path d="M8 9h8M8 13h5M13 16l3-3-3-3" /></svg>
)

export const DoctorTileIcon = ({ className = 'w-14' }) => (
  <svg viewBox="0 0 64 64" className={className}>
    <rect width="64" height="64" rx="12" fill="#F2F3FF" />
    <path d="M14 56c0-12 8-18 18-18s18 6 18 18z" fill="#5F6FFF" />
    <ellipse cx="32" cy="24" rx="9" ry="11" fill="#F7DCC7" />
    <path d="M20 47h6M23 44v6" stroke="#fff" strokeWidth="2" />
    <circle cx="40" cy="48" r="3" fill="none" stroke="#fff" strokeWidth="2" />
  </svg>
)

export const AppointmentTileIcon = ({ className = 'w-14' }) => (
  <svg viewBox="0 0 64 64" className={className}>
    <rect width="64" height="64" rx="12" fill="#F2F3FF" />
    <rect x="16" y="12" width="26" height="36" rx="3" fill="#5F6FFF" />
    <rect x="20" y="12" width="4" height="36" fill="#4A59E8" />
    <circle cx="40" cy="42" r="8" fill="#FBE3CF" stroke="#F0A86E" strokeWidth="2.5" />
    <path d="M46 48l6 6" stroke="#F0A86E" strokeWidth="3" strokeLinecap="round" />
  </svg>
)

export const PatientTileIcon = ({ className = 'w-14' }) => (
  <svg viewBox="0 0 64 64" className={className}>
    <rect width="64" height="64" rx="12" fill="#F2F3FF" />
    <path d="M14 56c0-12 8-18 18-18s18 6 18 18z" fill="#5F6FFF" />
    <ellipse cx="32" cy="26" rx="10" ry="12" fill="#F7DCC7" />
    <path d="M22 24c0-8 4-12 10-12s10 4 10 12c-2-4-6-6-10-6s-8 2-10 6z" fill="#333" />
  </svg>
)

export const UploadPlaceholder = ({ className = 'w-20' }) => (
  <svg viewBox="0 0 80 80" className={className}>
    <circle cx="40" cy="40" r="40" fill="#F2F2F2" />
    <circle cx="40" cy="34" r="6" fill="#BDBDBD" />
    <path d="M28 52c0-6 6-9 12-9s12 3 12 9z" fill="#BDBDBD" />
  </svg>
)
