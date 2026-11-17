import { useContext, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { AppContext } from '../../context/AppContext'
import { specialityData } from '../../assets/assets'
import { UploadPlaceholder } from '../../assets/icons'

const AddDoctor = () => {
  const { backendUrl, aToken, getDoctorsData } = useContext(AppContext)

  const [docImg, setDocImg] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [experience, setExperience] = useState('1 Year')
  const [fees, setFees] = useState('')
  const [about, setAbout] = useState('')
  const [speciality, setSpeciality] = useState('General physician')
  const [degree, setDegree] = useState('')
  const [address1, setAddress1] = useState('')
  const [address2, setAddress2] = useState('')

  const onSubmitHandler = async (event) => {
    event.preventDefault()
    try {
      if (!docImg) return toast.error('Image not selected')

      const formData = new FormData()
      formData.append('image', docImg)
      formData.append('name', name)
      formData.append('email', email)
      formData.append('password', password)
      formData.append('experience', experience)
      formData.append('fees', Number(fees))
      formData.append('about', about)
      formData.append('speciality', speciality)
      formData.append('degree', degree)
      formData.append('address', JSON.stringify({ line1: address1, line2: address2 }))

      const { data } = await axios.post(backendUrl + '/api/admin/add-doctor', formData, { headers: { atoken: aToken } })
      if (data.success) {
        toast.success(data.message)
        getDoctorsData()
        setDocImg(false)
        setName(''); setEmail(''); setPassword(''); setFees(''); setAbout('')
        setDegree(''); setAddress1(''); setAddress2('')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const input = 'border border-gray-200 rounded px-3 py-2'

  return (
    <form onSubmit={onSubmitHandler} className="p-5">
      <p className="mb-3 text-lg font-medium">Add Doctor</p>

      <div className="bg-white px-8 py-8 border rounded w-full max-w-4xl max-h-[80vh] overflow-y-scroll">
        <div className="flex items-center gap-4 mb-8 text-gray-500">
          <label htmlFor="doc-img" className="cursor-pointer">
            {docImg ? (
              <img className="w-20 h-20 rounded-full object-cover bg-gray-100" src={URL.createObjectURL(docImg)} alt="" />
            ) : (
              <UploadPlaceholder className="w-20" />
            )}
          </label>
          <input onChange={e => setDocImg(e.target.files[0])} type="file" id="doc-img" accept="image/*" hidden />
          <p>Upload doctor <br /> picture</p>
        </div>

        <div className="flex flex-col lg:flex-row items-start gap-10 text-gray-600">
          <div className="w-full lg:flex-1 flex flex-col gap-4">
            <div className="flex-1 flex flex-col gap-1">
              <p>Your name</p>
              <input onChange={e => setName(e.target.value)} value={name} className={input} type="text" placeholder="Name" required />
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <p>Doctor Email</p>
              <input onChange={e => setEmail(e.target.value)} value={email} className={input} type="email" placeholder="Email" required />
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <p>Set Password</p>
              <input onChange={e => setPassword(e.target.value)} value={password} className={input} type="password" placeholder="Password" required />
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <p>Experience</p>
              <select onChange={e => setExperience(e.target.value)} value={experience} className={input}>
                {Array.from({ length: 10 }, (_, i) => i + 1).map(n => (
                  <option key={n} value={`${n} Year${n > 1 ? 's' : ''}`}>{n} Year{n > 1 ? 's' : ''}</option>
                ))}
              </select>
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <p>Fees</p>
              <input onChange={e => setFees(e.target.value)} value={fees} className={input} type="number" min="0" placeholder="Doctor fees" required />
            </div>
          </div>

          <div className="w-full lg:flex-1 flex flex-col gap-4">
            <div className="flex-1 flex flex-col gap-1">
              <p>Speciality</p>
              <select onChange={e => setSpeciality(e.target.value)} value={speciality} className={input}>
                {specialityData.map(item => (
                  <option key={item.speciality} value={item.speciality}>{item.speciality}</option>
                ))}
              </select>
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <p>Degree</p>
              <input onChange={e => setDegree(e.target.value)} value={degree} className={input} type="text" placeholder="Degree" required />
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <p>Address</p>
              <input onChange={e => setAddress1(e.target.value)} value={address1} className={input} type="text" placeholder="Address 1" required />
              <input onChange={e => setAddress2(e.target.value)} value={address2} className={input} type="text" placeholder="Address 2" required />
            </div>
          </div>
        </div>

        <div>
          <p className="mt-4 mb-2 text-gray-600">About Doctor</p>
          <textarea onChange={e => setAbout(e.target.value)} value={about} className="w-full px-4 pt-2 border rounded" rows={5} placeholder="Write about doctor" required />
        </div>

        <button type="submit" className="bg-primary px-10 py-3 mt-4 text-white rounded-full">Add doctor</button>
      </div>
    </form>
  )
}

export default AddDoctor
