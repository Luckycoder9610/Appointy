import doctorModel from '../models/doctorModel.js'

// GET /api/doctor/list - public list of doctors
const doctorList = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select(['-password', '-email'])
    res.json({ success: true, doctors })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

// remove a booked time from a doctor's slots_booked (used when cancelling)
const releaseSlot = async (docId, slotDate, slotTime) => {
  const doctor = await doctorModel.findById(docId)
  if (!doctor) return
  const slots_booked = doctor.slots_booked
  if (slots_booked[slotDate]) {
    slots_booked[slotDate] = slots_booked[slotDate].filter(t => t !== slotTime)
  }
  await doctorModel.findByIdAndUpdate(docId, { slots_booked })
}

export { doctorList, releaseSlot }
