import { NavLink } from 'react-router-dom'
import { HomeIcon, CalendarIcon, AddIcon, PeopleIcon } from '../../assets/icons'

const items = [
  { to: '/admin', label: 'Dashboard', Icon: HomeIcon, end: true },
  { to: '/admin/appointments', label: 'Appointments', Icon: CalendarIcon },
  { to: '/admin/add-doctor', label: 'Add Doctor', Icon: AddIcon },
  { to: '/admin/doctors', label: 'Doctors List', Icon: PeopleIcon }
]

const Sidebar = () => {
  return (
    <div className="min-h-screen bg-white border-r">
      <ul className="text-[#515151] mt-5">
        {items.map(({ to, label, Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''}`
            }
          >
            <Icon className="w-6 text-[#2B3A55]" />
            <p className="hidden md:block">{label}</p>
          </NavLink>
        ))}
      </ul>
    </div>
  )
}

export default Sidebar
