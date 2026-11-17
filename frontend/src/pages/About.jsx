const About = () => {
  return (
    <div>
      <div className="text-center text-2xl pt-10 text-[#707070]">
        <p>ABOUT <span className="text-gray-700 font-semibold">US</span></p>
      </div>

      <div className="my-10 flex flex-col gap-6 md:w-3/4 m-auto text-sm text-gray-600 leading-6">
        <p>
          Welcome to Appointy, a simple way to manage your healthcare needs. We know how hard it can be to find
          the right doctor and get an appointment, so Appointy lets you browse trusted doctors, see their speciality,
          experience and fees, and book a time slot that suits you.
        </p>
        <p>
          Patients can manage all their appointments in one place, pay online and cancel when plans change.
          Clinic administrators get a single dashboard to manage doctors and keep track of every booking.
        </p>
        <b className="text-gray-800">Our Vision</b>
        <p>
          Our vision is to make booking a doctor as easy as possible, replacing long queues and phone calls with a
          quick, reliable online process.
        </p>
      </div>

      <div className="text-xl my-4">
        <p>WHY <span className="text-gray-700 font-semibold">CHOOSE US</span></p>
      </div>
      <div className="flex flex-col md:flex-row mb-20">
        {[
          ['EFFICIENCY:', 'Streamlined appointment scheduling that fits into your busy lifestyle.'],
          ['CONVENIENCE:', 'Access to a network of trusted healthcare professionals in your area.'],
          ['PERSONALIZATION:', 'Keep your profile and appointment history in one place.']
        ].map(([title, text]) => (
          <div key={title} className="border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer">
            <b>{title}</b>
            <p>{text}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default About
