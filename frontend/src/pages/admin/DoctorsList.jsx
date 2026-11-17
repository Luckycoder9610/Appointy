import { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { AppContext } from '../../context/AppContext'

const DoctorsList = () => {
  const { backendUrl, aToken, imageUrl, getDoctorsData } = useContext(AppContext)
  const [doctors, setDoctors] = useState([])

  const getAllDoctors = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/admin/all-doctors', { headers: { atoken: aToken } })
      if (data.success) setDoctors(data.doctors)
      else toast.error(data.message)
    } catch (error) {
      toast.error(error.message)
    }
  }

  const changeAvailability = async (docId) => {
    try {
      const { data } = await axios.post(backendUrl + '/api/admin/change-availability', { docId }, { headers: { atoken: aToken } })
      if (data.success) {
        toast.success(data.message)
        getAllDoctors()
        getDoctorsData()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    getAllDoctors()
  }, [])

  return (
    <div className="m-5 max-h-[90vh] overflow-y-scroll">
      <h1 className="text-lg font-medium">All Doctors</h1>
      <div className="w-full flex flex-wrap gap-4 pt-5 gap-y-6">
        {doctors.map(item => (
          <div key={item._id} className="border border-[#C9D8FF] rounded-xl max-w-56 overflow-hidden group bg-white">
            <img className="bg-[#EAEFFF] group-hover:bg-primary transition-all duration-500 w-56 aspect-square object-cover" src={imageUrl(item.image)} alt="" />
            <div className="p-4">
              <p className="text-[#262626] text-lg font-medium">{item.name}</p>
              <p className="text-[#5C5C5C] text-sm">{item.speciality}</p>
              <div className="mt-2 flex items-center gap-1 text-sm">
                <input onChange={() => changeAvailability(item._id)} type="checkbox" checked={item.available} id={item._id} />
                <label htmlFor={item._id}>Available</label>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default DoctorsList
