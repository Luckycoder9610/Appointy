import { useContext, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import Logo from './Logo'
import { ChevronDown, MenuIcon, CrossIcon, UserIcon } from '../assets/icons'

const links = [
  { to: '/', label: 'HOME' },
  { to: '/doctors', label: 'ALL DOCTORS' },
  { to: '/about', label: 'ABOUT' },
  { to: '/contact', label: 'CONTACT' }
]

const Navbar = () => {
  const navigate = useNavigate()
  const { token, setToken, userData, imageUrl } = useContext(AppContext)
  const [showMenu, setShowMenu] = useState(false)

  const logout = () => {
    setToken('')
    navigate('/login')
  }

  return (
    <div className="flex items-center justify-between text-sm py-3 mb-5 border-b border-b-gray-400">
      <Logo onClick={() => navigate('/')} />

      <ul className="hidden md:flex items-start gap-6 font-medium">
        {links.map(link => (
          <NavLink key={link.to} to={link.to} end={link.to === '/'}>
            <li className="py-1">{link.label}</li>
            <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
          </NavLink>
        ))}
      </ul>

      <div className="flex items-center gap-4">
        {token && userData ? (
          <div className="flex items-center gap-2 cursor-pointer group relative">
            {userData.image ? (
              <img className="w-12 h-12 rounded-full object-cover" src={imageUrl(userData.image)} alt="" />
            ) : (
              <div className="w-12 h-12 rounded-full bg-[#EAEFFF] flex items-center justify-center text-[#A7B4FF]">
                <UserIcon className="w-5" />
              </div>
            )}
            <ChevronDown className="w-3 text-gray-600" />
            <div className="absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block">
              <div className="min-w-48 bg-gray-50 rounded flex flex-col gap-4 p-4 shadow">
                <p onClick={() => navigate('/my-profile')} className="hover:text-black cursor-pointer">My Profile</p>
                <p onClick={() => navigate('/my-appointments')} className="hover:text-black cursor-pointer">My Appointments</p>
                <p onClick={logout} className="hover:text-black cursor-pointer">Logout</p>
              </div>
            </div>
          </div>
        ) : (
          <>
            <button onClick={() => navigate('/admin/login')} className="bg-primary text-white text-xs px-5 py-2 rounded-full hidden md:block">
              Admin Panel
            </button>
            <button onClick={() => navigate('/login')} className="bg-primary text-white px-9 py-4 rounded-full font-light hidden md:block">
              Create Account
            </button>
          </>
        )}

        <button onClick={() => setShowMenu(true)} className="md:hidden text-gray-700">
          <MenuIcon />
        </button>

        {/* mobile menu */}
        <div className={`md:hidden ${showMenu ? 'fixed w-full' : 'h-0 w-0'} right-0 top-0 bottom-0 z-30 overflow-hidden bg-white transition-all`}>
          <div className="flex items-center justify-between px-5 py-6">
            <Logo small onClick={() => { setShowMenu(false); navigate('/') }} />
            <button onClick={() => setShowMenu(false)}><CrossIcon className="w-7" /></button>
          </div>
          <ul className="flex flex-col items-center gap-2 mt-5 px-5 text-lg font-medium">
            {links.map(link => (
              <NavLink key={link.to} to={link.to} end={link.to === '/'} onClick={() => setShowMenu(false)}>
                <p className="px-4 py-2 rounded-full inline-block">{link.label}</p>
              </NavLink>
            ))}
            {!token && (
              <>
                <NavLink to="/login" onClick={() => setShowMenu(false)}><p className="px-4 py-2 rounded-full inline-block">CREATE ACCOUNT</p></NavLink>
                <NavLink to="/admin/login" onClick={() => setShowMenu(false)}><p className="px-4 py-2 rounded-full inline-block">ADMIN PANEL</p></NavLink>
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Navbar
