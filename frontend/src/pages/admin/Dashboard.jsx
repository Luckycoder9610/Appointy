import { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { AppContext } from '../../context/AppContext'
import { DoctorTileIcon, AppointmentTileIcon, PatientTileIcon, ListIcon, CrossIcon } from '../../assets/icons'

const Dashboard = () => {
  const { backendUrl, aToken, imageUrl, slotDateFormat } = useContext(AppContext)
  const [dashData, setDashData] = useState(null)

  const getDashData = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/admin/dashboard', { headers: { atoken: aToken } })
      if (data.success) setDashData(data.dashData)
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
        getDashData()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    getDashData()
  }, [])

  if (!dashData) return null

  const cards = [
    { count: dashData.doctors, label: 'Doctors', Icon: DoctorTileIcon },
    { count: dashData.appointments, label: 'Appointments', Icon: AppointmentTileIcon },
    { count: dashData.patients, label: 'Patients', Icon: PatientTileIcon }
  ]

  return (
    <div className="m-5">
      <div className="flex flex-wrap gap-3">
        {cards.map(({ count, label, Icon }) => (
          <div key={label} className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
            <Icon className="w-14" />
            <div>
              <p className="text-xl font-semibold text-gray-600">{count}</p>
              <p className="text-gray-400">{label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white max-w-[48rem]">
        <div className="flex items-center gap-2.5 px-4 py-4 mt-10 rounded-t border">
          <ListIcon className="w-6" />
          <p className="font-semibold">Latest Bookings</p>
        </div>

        <div className="pt-4 border border-t-0">
          {dashData.latestAppointments.length === 0 && <p className="px-6 pb-4 text-sm text-gray-500">No bookings yet.</p>}
          {dashData.latestAppointments.map(item => (
            <div key={item._id} className="flex items-center px-6 py-3 gap-3 hover:bg-gray-100">
              <img className="rounded-full w-10 h-10 object-cover" src={imageUrl(item.docData.image)} alt="" />
              <div className="flex-1 text-sm">
                <p className="text-gray-800 font-medium">{item.docData.name}</p>
                <p className="text-gray-600">Booking on {slotDateFormat(item.slotDate)}</p>
              </div>
              {item.cancelled ? (
                <p className="text-red-400 text-xs font-medium">Cancelled</p>
              ) : (
                <button onClick={() => cancelAppointment(item._id)} title="Cancel appointment" className="w-8 h-8 rounded-full bg-red-50 text-red-500 flex items-center justify-center">
                  <CrossIcon className="w-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
