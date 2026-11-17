import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { AppContext } from '../../context/AppContext'

const AdminLogin = () => {
  const navigate = useNavigate()
  const { backendUrl, aToken, setAToken } = useContext(AppContext)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const onSubmitHandler = async (event) => {
    event.preventDefault()
    try {
      const { data } = await axios.post(backendUrl + '/api/admin/login', { email, password })
      if (data.success) {
        setAToken(data.token)
        toast.success('Welcome, admin')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if (aToken) navigate('/admin')
  }, [aToken])

  return (
    <form onSubmit={onSubmitHandler} className="min-h-screen flex items-center">
      <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg">
        <p className="text-2xl font-semibold m-auto"><span className="text-primary">Admin</span> Login</p>
        <div className="w-full">
          <p>Email</p>
          <input onChange={e => setEmail(e.target.value)} value={email} className="border border-[#DADADA] rounded w-full p-2 mt-1" type="email" required />
        </div>
        <div className="w-full">
          <p>Password</p>
          <input onChange={e => setPassword(e.target.value)} value={password} className="border border-[#DADADA] rounded w-full p-2 mt-1" type="password" required />
        </div>
        <button type="submit" className="bg-primary text-white w-full py-2 rounded-md text-base">Login</button>
        <p>Back to <span onClick={() => navigate('/')} className="text-primary underline cursor-pointer">website</span></p>
      </div>
    </form>
  )
}

export default AdminLogin
