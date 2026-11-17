import { createContext, useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

export const AppContext = createContext()

const months = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const AppContextProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'
  const currency = import.meta.env.VITE_CURRENCY || '₹'

  const [doctors, setDoctors] = useState([])
  const [token, setToken] = useState(localStorage.getItem('token') || '')
  const [aToken, setAToken] = useState(localStorage.getItem('aToken') || '')
  const [userData, setUserData] = useState(false)

  // doctor images are either full URLs (seed data) or /uploads/... paths
  const imageUrl = (path) => {
    if (!path) return ''
    return path.startsWith('http') ? path : backendUrl + path
  }

  // "24_7_2026" -> "24 Jul 2026"
  const slotDateFormat = (slotDate) => {
    const [d, m, y] = slotDate.split('_')
    return `${d} ${months[Number(m)]} ${y}`
  }

  // age from a "YYYY-MM-DD" date of birth, "-" if not set
  const calculateAge = (dob) => {
    const birth = new Date(dob)
    if (!dob || isNaN(birth.getTime())) return '-'
    const today = new Date()
    let age = today.getFullYear() - birth.getFullYear()
    const m = today.getMonth() - birth.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--
    return age
  }

  const getDoctorsData = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/doctor/list')
      if (data.success) {
        setDoctors(data.doctors)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const loadUserProfile = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/user/get-profile', { headers: { token } })
      if (data.success) {
        setUserData(data.userData)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    getDoctorsData()
  }, [])

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token)
      loadUserProfile()
    } else {
      localStorage.removeItem('token')
      setUserData(false)
    }
  }, [token])

  useEffect(() => {
    if (aToken) {
      localStorage.setItem('aToken', aToken)
    } else {
      localStorage.removeItem('aToken')
    }
  }, [aToken])

  const value = {
    backendUrl, currency, doctors, getDoctorsData,
    token, setToken, aToken, setAToken,
    userData, setUserData, loadUserProfile,
    imageUrl, slotDateFormat, calculateAge
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export default AppContextProvider
