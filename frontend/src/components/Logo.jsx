import { assets } from '../assets/assets'

// Appointy logo: calendar icon with the brand name below it
const Logo = ({ onClick, small = false }) => (
  <div onClick={onClick} className="flex flex-col items-center cursor-pointer select-none w-fit">
    <img src={assets.logo_icon} alt="Appointy" className={small ? 'w-9' : 'w-14'} />
    <span className={`text-primary font-bold leading-none ${small ? 'text-lg' : 'text-2xl'}`}>Appointy</span>
  </div>
)

export default Logo
