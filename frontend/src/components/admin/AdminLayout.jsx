import { useContext } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { AppContext } from '../../context/AppContext'
import Logo from '../Logo'
import Sidebar from './Sidebar'

const AdminLayout = () => {
  const navigate = useNavigate()
  const { setAToken } = useContext(AppContext)

  const logout = () => {
    setAToken('')
    navigate('/admin/login')
  }

  return (
    <div className="bg-[#F8F9FD] min-h-screen">
      <div className="flex justify-between items-center px-4 sm:px-10 py-3 border-b bg-white">
        <div className="flex items-center gap-3 text-xs">
          <Logo small onClick={() => navigate('/admin')} />
          <p className="border px-2.5 py-0.5 rounded-full border-gray-500 text-gray-600">Admin</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/')} className="text-gray-600 text-sm px-4 py-2 hidden sm:block">View site</button>
          <button onClick={logout} className="bg-primary text-white text-sm px-10 py-2 rounded-full">Logout</button>
        </div>
      </div>
      <div className="flex items-start">
        <Sidebar />
        <div className="flex-1 min-w-0">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default AdminLayout
