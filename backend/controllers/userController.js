import validator from 'validator'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import userModel from '../models/userModel.js'
import doctorModel from '../models/doctorModel.js'
import appointmentModel from '../models/appointmentModel.js'
import { releaseSlot } from './doctorController.js'

const createToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET)

// POST /api/user/register
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body
    if (!name || !email || !password) {
      return res.json({ success: false, message: 'Missing details' })
    }
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: 'Enter a valid email' })
    }
    if (password.length < 8) {
      return res.json({ success: false, message: 'Password must be at least 8 characters' })
    }
    const exists = await userModel.findOne({ email })
    if (exists) {
      return res.json({ success: false, message: 'User already exists' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await userModel.create({ name, email, password: hashedPassword })
    res.json({ success: true, token: createToken(user._id) })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

// POST /api/user/login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await userModel.findOne({ email })
    if (!user) {
      return res.json({ success: false, message: 'User does not exist' })
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.json({ success: false, message: 'Invalid credentials' })
    }
    res.json({ success: true, token: createToken(user._id) })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

// GET /api/user/get-profile
const getProfile = async (req, res) => {
  try {
    const userData = await userModel.findById(req.userId).select('-password')
    res.json({ success: true, userData })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

// POST /api/user/update-profile (multipart, optional image)
const updateProfile = async (req, res) => {
  try {
    const { name, phone, address, dob, gender } = req.body
    if (!name || !phone || !dob || !gender) {
      return res.json({ success: false, message: 'Data missing' })
    }
    const update = { name, phone, dob, gender, address: JSON.parse(address || '{}') }
    if (req.file) {
      update.image = '/uploads/' + req.file.filename
    }
    await userModel.findByIdAndUpdate(req.userId, update)
    res.json({ success: true, message: 'Profile updated' })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

// POST /api/user/book-appointment
const bookAppointment = async (req, res) => {
  try {
    const { docId, slotDate, slotTime } = req.body
    const docData = await doctorModel.findById(docId).select('-password')
    if (!docData) {
      return res.json({ success: false, message: 'Doctor not found' })
    }
    if (!docData.available) {
      return res.json({ success: false, message: 'Doctor not available' })
    }

    const slots_booked = docData.slots_booked
    if (slots_booked[slotDate]?.includes(slotTime)) {
      return res.json({ success: false, message: 'Slot not available' })
    }
    slots_booked[slotDate] = [...(slots_booked[slotDate] || []), slotTime]

    const userData = await userModel.findById(req.userId).select('-password')
    const doc = docData.toObject()
    delete doc.slots_booked

    await appointmentModel.create({
      userId: req.userId,
      docId,
      userData,
      docData: doc,
      amount: docData.fees,
      slotTime,
      slotDate,
      date: Date.now()
    })
    await doctorModel.findByIdAndUpdate(docId, { slots_booked })

    res.json({ success: true, message: 'Appointment Booked' })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

// GET /api/user/appointments
const listAppointments = async (req, res) => {
  try {
    const appointments = await appointmentModel.find({ userId: req.userId }).sort({ date: -1 })
    res.json({ success: true, appointments })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

// POST /api/user/cancel-appointment
const cancelAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.body
    const appointment = await appointmentModel.findById(appointmentId)
    if (!appointment || appointment.userId !== req.userId) {
      return res.json({ success: false, message: 'Unauthorized action' })
    }
    await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })
    await releaseSlot(appointment.docId, appointment.slotDate, appointment.slotTime)
    res.json({ success: true, message: 'Appointment cancelled' })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

// POST /api/user/pay-appointment (mock payment)
const payAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.body
    const appointment = await appointmentModel.findById(appointmentId)
    if (!appointment || appointment.userId !== req.userId) {
      return res.json({ success: false, message: 'Unauthorized action' })
    }
    if (appointment.cancelled) {
      return res.json({ success: false, message: 'Appointment is cancelled' })
    }
    await appointmentModel.findByIdAndUpdate(appointmentId, { payment: true })
    res.json({ success: true, message: 'Payment successful' })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

export {
  registerUser, loginUser, getProfile, updateProfile,
  bookAppointment, listAppointments, cancelAppointment, payAppointment
}
