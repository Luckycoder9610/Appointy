import { useNavigate } from 'react-router-dom'
import Logo from './Logo'

const Footer = () => {
  const navigate = useNavigate()

  return (
    <div className="md:mx-10">
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm">
        <div>
          <div className="mb-5">
            <Logo onClick={() => { navigate('/'); window.scrollTo(0, 0) }} />
          </div>
          <p className="w-full md:w-2/3 text-gray-600 leading-6">
            Appointy is a simple online doctor appointment system. Browse trusted doctors by speciality,
            check their fees and experience, and book a convenient time slot in just a few clicks.
          </p>
        </div>

        <div>
          <p className="text-xl font-medium mb-5">COMPANY</p>
          <ul className="flex flex-col gap-2 text-gray-600">
            <li className="cursor-pointer" onClick={() => navigate('/')}>Home</li>
            <li className="cursor-pointer" onClick={() => navigate('/about')}>About us</li>
            <li className="cursor-pointer" onClick={() => navigate('/contact')}>Contact us</li>
            <li>Privacy policy</li>
          </ul>
        </div>

        <div>
          <p className="text-xl font-medium mb-5">GET IN TOUCH</p>
          <ul className="flex flex-col gap-2 text-gray-600">
            <li>+91 98765 43210</li>
            <li>support@appointy.com</li>
          </ul>
        </div>
      </div>

      <div>
        <hr />
        <p className="py-5 text-sm text-center">Copyright © 2026 Appointy – All Rights Reserved.</p>
      </div>
    </div>
  )
}

export default Footer
