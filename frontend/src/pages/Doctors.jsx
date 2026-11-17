import { useContext, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { specialityData } from '../assets/assets'
import DoctorCard from '../components/DoctorCard'

const Doctors = () => {
  const { speciality } = useParams()
  const navigate = useNavigate()
  const { doctors } = useContext(AppContext)
  const [showFilter, setShowFilter] = useState(false)

  const filtered = speciality ? doctors.filter(d => d.speciality === speciality) : doctors

  return (
    <div>
      <p className="text-gray-600">Browse through the doctors specialist.</p>
      <div className="flex flex-col sm:flex-row items-start gap-5 mt-5">
        <button
          onClick={() => setShowFilter(!showFilter)}
          className={`py-1 px-3 border rounded text-sm transition-all sm:hidden ${showFilter ? 'bg-primary text-white' : ''}`}
        >
          Filters
        </button>

        <div className={`flex-col gap-4 text-sm text-gray-600 ${showFilter ? 'flex' : 'hidden sm:flex'}`}>
          {specialityData.map(item => (
            <p
              key={item.speciality}
              onClick={() => speciality === item.speciality ? navigate('/doctors') : navigate(`/doctors/${item.speciality}`)}
              className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === item.speciality ? 'bg-[#E2E5FF] text-black' : ''}`}
            >
              {item.speciality}
            </p>
          ))}
        </div>

        <div className="w-full grid grid-cols-auto gap-4 gap-y-6">
          {filtered.map(doctor => (
            <DoctorCard key={doctor._id} doctor={doctor} />
          ))}
          {filtered.length === 0 && <p className="text-gray-500">No doctors found for this speciality.</p>}
        </div>
      </div>
    </div>
  )
}

export default Doctors
