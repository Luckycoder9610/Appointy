import logo_icon from './logo_icon.svg'
import header_doctors from './header_doctors.svg'
import General_physician from './General_physician.svg'
import Gynecologist from './Gynecologist.svg'
import Dermatologist from './Dermatologist.svg'
import Pediatricians from './Pediatricians.svg'
import Neurologist from './Neurologist.svg'
import Gastroenterologist from './Gastroenterologist.svg'

export const assets = {
  logo_icon,
  header_doctors,
  group_profiles: [
    'https://randomuser.me/api/portraits/men/11.jpg',
    'https://randomuser.me/api/portraits/men/22.jpg',
    'https://randomuser.me/api/portraits/women/33.jpg'
  ]
}

export const specialityData = [
  { speciality: 'General physician', image: General_physician },
  { speciality: 'Gynecologist', image: Gynecologist },
  { speciality: 'Dermatologist', image: Dermatologist },
  { speciality: 'Pediatricians', image: Pediatricians },
  { speciality: 'Neurologist', image: Neurologist },
  { speciality: 'Gastroenterologist', image: Gastroenterologist }
]
