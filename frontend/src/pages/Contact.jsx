const Contact = () => {
  return (
    <div>
      <div className="text-center text-2xl pt-10 text-[#707070]">
        <p>CONTACT <span className="text-gray-700 font-semibold">US</span></p>
      </div>

      <div className="my-10 flex flex-col items-center gap-6 mb-28 text-sm">
        <div className="flex flex-col items-start gap-5 text-gray-600 border rounded-xl p-10 min-w-80">
          <p className="font-semibold text-lg text-gray-700">OUR OFFICE</p>
          <p>17th Cross, Richmond Road <br /> Bangalore, Karnataka</p>
          <p>Tel: +91 98765 43210 <br /> Email: support@appointy.com</p>
          <p className="font-semibold text-lg text-gray-700">WORKING HOURS</p>
          <p>Monday – Sunday <br /> 10:00 AM – 9:00 PM</p>
        </div>
      </div>
    </div>
  )
}

export default Contact
