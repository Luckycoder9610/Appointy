import { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { AppContext } from '../context/AppContext'
import { VerifiedIcon, InfoIcon } from '../assets/icons'
import DoctorCard from '../components/DoctorCard'

const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

const Appointment = () => {
  const { docId } = useParams()
  const navigate = useNavigate()
  const { doctors, currency, backendUrl, token, getDoctorsData, imageUrl } = useContext(AppContext)

  const [docInfo, setDocInfo] = useState(null)
  const [docSlots, setDocSlots] = useState([])
  const [slotIndex, setSlotIndex] = useState(0)
  const [slotTime, setSlotTime] = useState('')

  // build 7 days of 30-minute slots from 10:00 AM to 9:00 PM
  const getAvailableSlots = () => {
    const allSlots = []
    const today = new Date()

    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(today)
      currentDate.setDate(today.getDate() + i)

      const endTime = new Date(currentDate)
      endTime.setHours(21, 0, 0, 0)

      if (i === 0) {
        // today: start from the next half hour (but not before 10 AM)
        const hour = currentDate.getHours()
        const minutes = currentDate.getMinutes()
        currentDate.setHours(hour >= 10 ? (minutes >= 30 ? hour + 1 : hour) : 10)
        currentDate.setMinutes(hour >= 10 && minutes < 30 ? 30 : 0, 0, 0)
      } else {
        currentDate.setHours(10, 0, 0, 0)
      }

      const daySlots = []
      while (currentDate < endTime) {
        const time = currentDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
        const slotDate = `${currentDate.getDate()}_${currentDate.getMonth() + 1}_${currentDate.getFullYear()}`
        const booked = docInfo.slots_booked[slotDate]?.includes(time)
        if (!booked) {
          daySlots.push({ datetime: new Date(currentDate), time })
        }
        currentDate.setMinutes(currentDate.getMinutes() + 30)
      }

      // keep the date even when no slots are left, so the day pill still shows
      const dayDate = new Date(today)
      dayDate.setDate(today.getDate() + i)
      allSlots.push({ date: dayDate, slots: daySlots })
    }
    setDocSlots(allSlots)
  }

  const bookAppointment = async () => {
    if (!token) {
      toast.warning('Login to book appointment')
      return navigate('/login')
    }
    if (!slotTime) {
      return toast.warning('Please select a time slot')
    }
    const date = docSlots[slotIndex].date
    const slotDate = `${date.getDate()}_${date.getMonth() + 1}_${date.getFullYear()}`

    try {
      const { data } = await axios.post(
        backendUrl + '/api/user/book-appointment',
        { docId, slotDate, slotTime },
        { headers: { token } }
      )
      if (data.success) {
        toast.success(data.message)
        getDoctorsData()
        navigate('/my-appointments')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    setDocInfo(doctors.find(doc => doc._id === docId) || null)
  }, [doctors, docId])

  useEffect(() => {
    if (docInfo) getAvailableSlots()
  }, [docInfo])

  if (!docInfo) return <p className="text-gray-500 py-20 text-center">Loading doctor details...</p>

  const related = doctors.filter(d => d.speciality === docInfo.speciality && d._id !== docId).slice(0, 5)

  return (
    <div>
      {/* doctor details */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="sm:w-72 flex-shrink-0">
          <img className="bg-primary w-full sm:max-w-72 aspect-square object-cover rounded-lg" src={imageUrl(docInfo.image)} alt="" />
        </div>

        <div className="flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0">
          <p className="flex items-center gap-2 text-3xl font-medium text-gray-700">
            {docInfo.name} <VerifiedIcon className="w-6" />
          </p>
          <div className="flex items-center gap-2 mt-1 text-gray-600">
            <p>{docInfo.degree} - {docInfo.speciality}</p>
            <button className="py-0.5 px-2 border text-xs rounded-full">{docInfo.experience}</button>
          </div>
          <div>
            <p className="flex items-center gap-1 text-sm font-medium text-[#262626] mt-3">
              About <InfoIcon className="w-4" />
            </p>
            <p className="text-sm text-gray-600 max-w-[700px] mt-1">{docInfo.about}</p>
          </div>
          <p className="text-gray-600 font-medium mt-4">
            Appointment fee: <span className="text-gray-800">{currency} {docInfo.fees}</span>
          </p>
        </div>
      </div>

      {/* booking slots */}
      <div className="sm:ml-72 sm:pl-4 mt-8 font-medium text-[#565656]">
        <p>Booking slots</p>
        {!docInfo.available && <p className="text-red-500 text-sm mt-2">This doctor is currently not available for booking.</p>}

        <div className="flex gap-3 items-center w-full overflow-x-scroll mt-4">
          {docSlots.map((item, index) => (
            <div
              key={index}
              onClick={() => { setSlotIndex(index); setSlotTime('') }}
              className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${slotIndex === index ? 'bg-primary text-white' : 'border border-[#DDDDDD]'}`}
            >
              <p>{daysOfWeek[item.date.getDay()]}</p>
              <p>{item.date.getDate()}</p>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3 w-full overflow-x-scroll mt-4">
          {docSlots[slotIndex]?.slots.map((item, index) => (
            <p
              key={index}
              onClick={() => setSlotTime(item.time)}
              className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${item.time === slotTime ? 'bg-primary text-white' : 'text-[#949494] border border-[#B4B4B4]'}`}
            >
              {item.time.toLowerCase()}
            </p>
          ))}
          {docSlots[slotIndex]?.slots.length === 0 && <p className="text-sm font-light text-gray-500">No slots left for this day.</p>}
        </div>

        <button onClick={bookAppointment} className="bg-primary text-white text-sm font-light px-20 py-3 rounded-full my-6">
          Book an appointment
        </button>
      </div>

      {/* related doctors */}
      {related.length > 0 && (
        <div className="flex flex-col items-center gap-4 my-16 text-[#262626]">
          <h1 className="text-3xl font-medium">Related Doctors</h1>
          <p className="sm:w-1/3 text-center text-sm">Simply browse through our extensive list of trusted doctors.</p>
          <div className="w-full grid grid-cols-auto gap-4 pt-5 gap-y-6">
            {related.map(doctor => <DoctorCard key={doctor._id} doctor={doctor} />)}
          </div>
        </div>
      )}
    </div>
  )
}

export default Appointment
