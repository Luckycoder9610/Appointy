import { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { AppContext } from '../context/AppContext'

const MyAppointments = () => {
  const { backendUrl, token, getDoctorsData, imageUrl, slotDateFormat } = useContext(AppContext)
  const [appointments, setAppointments] = useState([])

  const getUserAppointments = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/user/appointments', { headers: { token } })
      if (data.success) setAppointments(data.appointments)
      else toast.error(data.message)
    } catch (error) {
      toast.error(error.message)
    }
  }

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(backendUrl + '/api/user/cancel-appointment', { appointmentId }, { headers: { token } })
      if (data.success) {
        toast.success(data.message)
        getUserAppointments()
        getDoctorsData()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  // mock payment: just marks the appointment as paid
  const payAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(backendUrl + '/api/user/pay-appointment', { appointmentId }, { headers: { token } })
      if (data.success) {
        toast.success(data.message)
        getUserAppointments()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if (token) getUserAppointments()
  }, [token])

  return (
    <div>
      <p className="pb-3 mt-12 text-lg font-medium text-gray-600 border-b">My appointments</p>
      {appointments.length === 0 && <p className="text-gray-500 text-sm mt-6">You have no appointments yet.</p>}

      {appointments.map(item => (
        <div key={item._id} className="grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-4 border-b">
          <div>
            <img className="w-36 aspect-square object-cover bg-[#EAEFFF]" src={imageUrl(item.docData.image)} alt="" />
          </div>
          <div className="flex-1 text-sm text-[#5E5E5E]">
            <p className="text-[#262626] text-base font-semibold">{item.docData.name}</p>
            <p>{item.docData.speciality}</p>
            <p className="text-[#464646] font-medium mt-1">Address:</p>
            <p>{item.docData.address.line1}</p>
            <p>{item.docData.address.line2}</p>
            <p className="mt-1">
              <span className="text-sm text-[#3C3C3C] font-medium">Date & Time:</span> {slotDateFormat(item.slotDate)} | {item.slotTime}
            </p>
          </div>
          <div></div>
          <div className="flex flex-col gap-2 justify-end text-sm text-center">
            {!item.cancelled && item.payment && (
              <button className="sm:min-w-48 py-2 border rounded text-[#696969] bg-[#EAEFFF]">Paid</button>
            )}
            {!item.cancelled && !item.payment && (
              <button onClick={() => payAppointment(item._id)} className="text-[#696969] sm:min-w-48 py-2 border rounded hover:bg-primary hover:text-white transition-all duration-300">
                Pay Online
              </button>
            )}
            {!item.cancelled && (
              <button onClick={() => cancelAppointment(item._id)} className="text-[#696969] sm:min-w-48 py-2 border rounded hover:bg-red-600 hover:text-white transition-all duration-300">
                Cancel appointment
              </button>
            )}
            {item.cancelled && (
              <button className="sm:min-w-48 py-2 border border-red-500 rounded text-red-500">Appointment cancelled</button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

export default MyAppointments
