import { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { AppContext } from '../../context/AppContext'
import { CrossIcon, UserIcon } from '../../assets/icons'

const AllAppointments = () => {
  const { backendUrl, aToken, currency, imageUrl, slotDateFormat, calculateAge } = useContext(AppContext)
  const [appointments, setAppointments] = useState([])

  const getAllAppointments = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/admin/appointments', { headers: { atoken: aToken } })
      if (data.success) setAppointments(data.appointments)
      else toast.error(data.message)
    } catch (error) {
      toast.error(error.message)
    }
  }

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(backendUrl + '/api/admin/cancel-appointment', { appointmentId }, { headers: { atoken: aToken } })
      if (data.success) {
        toast.success(data.message)
        getAllAppointments()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    getAllAppointments()
  }, [])

  const row = 'grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] gap-1'

  return (
    <div className="max-w-6xl p-5">
      <p className="mb-3 text-lg font-medium">All Appointments</p>
      <div className="bg-white border rounded text-sm max-h-[80vh] overflow-y-scroll">
        <div className={`hidden sm:grid ${row} py-3 px-6 border-b`}>
          <p>#</p>
          <p>Patient</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Doctor</p>
          <p>Fees</p>
          <p>Action</p>
        </div>

        {appointments.length === 0 && <p className="py-4 px-6 text-gray-500">No appointments yet.</p>}

        {appointments.map((item, index) => (
          <div key={item._id} className={`flex flex-wrap justify-between max-sm:gap-2 sm:${row} sm:grid items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50`}>
            <p className="max-sm:hidden">{index + 1}</p>
            <div className="flex items-center gap-2">
              {item.userData.image ? (
                <img className="w-8 h-8 rounded-full object-cover" src={imageUrl(item.userData.image)} alt="" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-[#EAEFFF] text-[#A7B4FF] flex items-center justify-center"><UserIcon className="w-4" /></div>
              )}
              <p>{item.userData.name}</p>
            </div>
            <p className="max-sm:hidden">{calculateAge(item.userData.dob)}</p>
            <p>{slotDateFormat(item.slotDate)} {item.slotTime}</p>
            <div className="flex items-center gap-2">
              <img className="w-8 h-8 rounded-full object-cover bg-gray-200" src={imageUrl(item.docData.image)} alt="" />
              <p>{item.docData.name}</p>
            </div>
            <p>{currency}{item.amount}</p>
            {item.cancelled ? (
              <p className="text-red-400 text-xs font-medium">Cancelled</p>
            ) : (
              <div className="flex items-center gap-2">
                <button onClick={() => cancelAppointment(item._id)} title="Cancel appointment" className="w-8 h-8 rounded-full bg-red-50 text-red-500 flex items-center justify-center">
                  <CrossIcon className="w-4" />
                </button>
                {item.payment && <p className="text-green-500 text-xs">Paid</p>}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default AllAppointments
