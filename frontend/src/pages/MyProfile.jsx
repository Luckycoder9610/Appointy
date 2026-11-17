import { useContext, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { AppContext } from '../context/AppContext'
import { UserIcon } from '../assets/icons'

const MyProfile = () => {
  const { userData, setUserData, token, backendUrl, loadUserProfile, imageUrl } = useContext(AppContext)
  const [isEdit, setIsEdit] = useState(false)
  const [image, setImage] = useState(false)

  const updateUserProfile = async () => {
    try {
      const formData = new FormData()
      formData.append('name', userData.name)
      formData.append('phone', userData.phone)
      formData.append('address', JSON.stringify(userData.address))
      formData.append('gender', userData.gender)
      formData.append('dob', userData.dob)
      if (image) formData.append('image', image)

      const { data } = await axios.post(backendUrl + '/api/user/update-profile', formData, { headers: { token } })
      if (data.success) {
        toast.success(data.message)
        await loadUserProfile()
        setIsEdit(false)
        setImage(false)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  if (!userData) return null

  const avatar = image ? URL.createObjectURL(image) : imageUrl(userData.image)

  return (
    <div className="max-w-lg flex flex-col gap-2 text-sm pt-5">
      <label htmlFor="image" className={isEdit ? 'cursor-pointer w-fit' : 'w-fit'}>
        {avatar ? (
          <img className={`w-36 h-36 rounded object-cover ${isEdit ? 'opacity-75' : ''}`} src={avatar} alt="" />
        ) : (
          <div className="w-36 h-36 rounded bg-[#EAEFFF] flex items-center justify-center text-[#A7B4FF]">
            <UserIcon className="w-16" />
          </div>
        )}
        {isEdit && <p className="text-xs text-primary mt-1">Click to change photo</p>}
        {isEdit && <input onChange={e => setImage(e.target.files[0])} type="file" id="image" accept="image/*" hidden />}
      </label>

      {isEdit ? (
        <input className="bg-gray-50 text-3xl font-medium max-w-60 mt-2" type="text" value={userData.name}
          onChange={e => setUserData(prev => ({ ...prev, name: e.target.value }))} />
      ) : (
        <p className="font-medium text-3xl text-[#262626] mt-2">{userData.name}</p>
      )}

      <hr className="bg-[#ADADAD] h-[1px] border-none" />

      <div>
        <p className="text-gray-600 underline mt-3">CONTACT INFORMATION</p>
        <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-[#363636]">
          <p className="font-medium">Email id:</p>
          <p className="text-primary">{userData.email}</p>
          <p className="font-medium">Phone:</p>
          {isEdit ? (
            <input className="bg-gray-50 max-w-52" type="text" value={userData.phone}
              onChange={e => setUserData(prev => ({ ...prev, phone: e.target.value }))} />
          ) : (
            <p className="text-primary">{userData.phone}</p>
          )}
          <p className="font-medium">Address:</p>
          {isEdit ? (
            <p>
              <input className="bg-gray-50" type="text" value={userData.address.line1}
                onChange={e => setUserData(prev => ({ ...prev, address: { ...prev.address, line1: e.target.value } }))} />
              <br />
              <input className="bg-gray-50 mt-1" type="text" value={userData.address.line2}
                onChange={e => setUserData(prev => ({ ...prev, address: { ...prev.address, line2: e.target.value } }))} />
            </p>
          ) : (
            <p className="text-gray-500">{userData.address.line1}<br />{userData.address.line2}</p>
          )}
        </div>
      </div>

      <div>
        <p className="text-gray-600 underline mt-3">BASIC INFORMATION</p>
        <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-gray-600">
          <p className="font-medium">Gender:</p>
          {isEdit ? (
            <select className="max-w-20 bg-gray-50" value={userData.gender}
              onChange={e => setUserData(prev => ({ ...prev, gender: e.target.value }))}>
              <option value="Not Selected">Not Selected</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          ) : (
            <p className="text-gray-500">{userData.gender}</p>
          )}
          <p className="font-medium">Birthday:</p>
          {isEdit ? (
            <input className="max-w-28 bg-gray-50" type="date" value={userData.dob === 'Not Selected' ? '' : userData.dob}
              onChange={e => setUserData(prev => ({ ...prev, dob: e.target.value }))} />
          ) : (
            <p className="text-gray-500">{userData.dob}</p>
          )}
        </div>
      </div>

      <div className="mt-10">
        {isEdit ? (
          <button onClick={updateUserProfile} className="border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all">
            Save information
          </button>
        ) : (
          <button onClick={() => setIsEdit(true)} className="border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all">
            Edit
          </button>
        )}
      </div>
    </div>
  )
}

export default MyProfile
