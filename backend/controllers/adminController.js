import validator from 'validator'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import doctorModel from '../models/doctorModel.js'
import userModel from '../models/userModel.js'
import appointmentModel from '../models/appointmentModel.js'
import { releaseSlot } from './doctorController.js'

// POST /api/admin/login
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      const token = jwt.sign(email + password, process.env.JWT_SECRET)
      res.json({ success: true, token })
    } else {
      res.json({ success: false, message: 'Invalid credentials' })
    }
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

// POST /api/admin/add-doctor (multipart with image)
const addDoctor = async (req, res) => {
  try {
    const { name, email, password, speciality, degree, experience, about, fees, address } = req.body
    if (!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address) {
      return res.json({ success: false, message: 'Missing details' })
    }
    if (!req.file) {
      return res.json({ success: false, message: 'Please upload doctor picture' })
    }
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: 'Enter a valid email' })
    }
    if (password.length < 8) {
      return res.json({ success: false, message: 'Password must be at least 8 characters' })
    }
    const exists = await doctorModel.findOne({ email })
    if (exists) {
      return res.json({ success: false, message: 'Doctor with this email already exists' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    await doctorModel.create({
      name,
      email,
      password: hashedPassword,
      image: '/uploads/' + req.file.filename,
      speciality,
      degree,
      experience,
      about,
      fees: Number(fees),
      address: JSON.parse(address),
      date: Date.now()
    })
    res.json({ success: true, message: 'Doctor added' })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

// GET /api/admin/all-doctors
const allDoctors = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select('-password')
    res.json({ success: true, doctors })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

// POST /api/admin/change-availability
const changeAvailability = async (req, res) => {
  try {
    const { docId } = req.body
    const doctor = await doctorModel.findById(docId)
    await doctorModel.findByIdAndUpdate(docId, { available: !doctor.available })
    res.json({ success: true, message: 'Availability changed' })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

// GET /api/admin/appointments
const appointmentsAdmin = async (req, res) => {
  try {
    const appointments = await appointmentModel.find({}).sort({ date: -1 })
    res.json({ success: true, appointments })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

// POST /api/admin/cancel-appointment
const appointmentCancel = async (req, res) => {
  try {
    const { appointmentId } = req.body
    const appointment = await appointmentModel.findById(appointmentId)
    if (!appointment) {
      return res.json({ success: false, message: 'Appointment not found' })
    }
    await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })
    await releaseSlot(appointment.docId, appointment.slotDate, appointment.slotTime)
    res.json({ success: true, message: 'Appointment cancelled' })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

// GET /api/admin/dashboard
const adminDashboard = async (req, res) => {
  try {
    const doctors = await doctorModel.countDocuments()
    const patients = await userModel.countDocuments()
    const appointments = await appointmentModel.find({}).sort({ date: -1 })
    const dashData = {
      doctors,
      appointments: appointments.length,
      patients,
      latestAppointments: appointments.slice(0, 5)
    }
    res.json({ success: true, dashData })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

export {
  loginAdmin, addDoctor, allDoctors, changeAvailability,
  appointmentsAdmin, appointmentCancel, adminDashboard
}
