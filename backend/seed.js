// Inserts sample doctors. Run with: npm run seed
import 'dotenv/config'
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import doctorModel from './models/doctorModel.js'

const photo = (gender, n) => `https://randomuser.me/api/portraits/${gender}/${n}.jpg`

const doctors = [
  { name: 'Dr. Aarav Sharma', speciality: 'General physician', degree: 'MBBS', experience: '5 Years', fees: 500, image: photo('men', 32),
    about: 'Dr. Aarav Sharma is committed to providing comprehensive primary care for patients of all ages, focusing on preventive medicine.' },
  { name: 'Dr. Rohan Mehta', speciality: 'General physician', degree: 'MBBS, MD', experience: '10 Years', fees: 700, image: photo('men', 75),
    about: 'Dr. Rohan Mehta has a decade of experience treating common illnesses, chronic conditions and lifestyle diseases.' },
  { name: 'Dr. Aditya Verma', speciality: 'General physician', degree: 'MBBS', experience: '3 Years', fees: 400, image: photo('men', 46),
    about: 'Dr. Aditya Verma focuses on early diagnosis and practical, patient-friendly treatment plans.' },
  { name: 'Dr. Ananya Iyer', speciality: 'Gynecologist', degree: 'MBBS, MS', experience: '8 Years', fees: 600, image: photo('women', 44),
    about: "Dr. Ananya Iyer specialises in women's health, pregnancy care and routine gynecological check-ups." },
  { name: 'Dr. Priya Nair', speciality: 'Gynecologist', degree: 'MBBS, DGO', experience: '4 Years', fees: 500, image: photo('women', 65),
    about: 'Dr. Priya Nair provides compassionate care for adolescent and adult gynecological concerns.' },
  { name: 'Dr. Kavya Reddy', speciality: 'Dermatologist', degree: 'MBBS, MD', experience: '6 Years', fees: 650, image: photo('women', 68),
    about: 'Dr. Kavya Reddy treats skin, hair and nail conditions, including acne, eczema and allergies.' },
  { name: 'Dr. Vikram Singh', speciality: 'Dermatologist', degree: 'MBBS, DDVL', experience: '2 Years', fees: 300, image: photo('men', 12),
    about: 'Dr. Vikram Singh offers modern, evidence-based treatment for common skin problems.' },
  { name: 'Dr. Sneha Kapoor', speciality: 'Pediatricians', degree: 'MBBS, DCH', experience: '7 Years', fees: 550, image: photo('women', 21),
    about: 'Dr. Sneha Kapoor cares for newborns, infants and children, from vaccinations to childhood illnesses.' },
  { name: 'Dr. Arjun Rao', speciality: 'Neurologist', degree: 'MBBS, DM', experience: '9 Years', fees: 800, image: photo('men', 85),
    about: 'Dr. Arjun Rao diagnoses and treats disorders of the brain and nervous system, such as migraine and epilepsy.' },
  { name: 'Dr. Meera Joshi', speciality: 'Gastroenterologist', degree: 'MBBS, DM', experience: '6 Years', fees: 750, image: photo('women', 50),
    about: 'Dr. Meera Joshi treats digestive system conditions including acidity, IBS and liver problems.' }
]

const addresses = [
  { line1: '17th Cross, Richmond Road', line2: 'Bangalore' },
  { line1: '27th Cross, Richmond Road', line2: 'Bangalore' },
  { line1: '37th Cross, MG Road', line2: 'Bangalore' },
  { line1: '47th Cross, Indiranagar', line2: 'Bangalore' }
]

const seed = async () => {
  await mongoose.connect(process.env.MONGODB_URI)
  await doctorModel.deleteMany({})

  const password = await bcrypt.hash('doctor123', 10)
  const docs = doctors.map((d, i) => ({
    ...d,
    email: d.name.toLowerCase().replace('dr. ', '').replace(' ', '.') + '@appointy.com',
    password,
    address: addresses[i % addresses.length],
    available: true,
    slots_booked: {},
    date: Date.now()
  }))

  await doctorModel.insertMany(docs)
  console.log(`Seeded ${docs.length} doctors`)
  await mongoose.disconnect()
}

seed().catch(err => {
  console.error(err)
  process.exit(1)
})
