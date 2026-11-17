import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const DoctorCard = ({ doctor }) => {
  const navigate = useNavigate()
  const { imageUrl } = useContext(AppContext)

  return (
    <div
      onClick={() => { navigate(`/appointment/${doctor._id}`); window.scrollTo(0, 0) }}
      className="border border-[#C9D8FF] rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500"
    >
      <img className="bg-[#EAEFFF] w-full aspect-square object-cover" src={imageUrl(doctor.image)} alt={doctor.name} />
      <div className="p-4">
        <div className={`flex items-center gap-2 text-sm ${doctor.available ? 'text-green-500' : 'text-gray-500'}`}>
          <p className={`w-2 h-2 rounded-full ${doctor.available ? 'bg-green-500' : 'bg-gray-500'}`}></p>
          <p>{doctor.available ? 'Available' : 'Not Available'}</p>
        </div>
        <p className="text-[#262626] text-lg font-medium">{doctor.name}</p>
        <p className="text-[#5C5C5C] text-sm">{doctor.speciality}</p>
      </div>
    </div>
  )
}

export default DoctorCard
