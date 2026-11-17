import jwt from 'jsonwebtoken'

// checks the admin token sent in the "atoken" header
const authAdmin = (req, res, next) => {
  try {
    const { atoken } = req.headers
    if (!atoken) {
      return res.json({ success: false, message: 'Not authorized, please login again' })
    }
    const decoded = jwt.verify(atoken, process.env.JWT_SECRET)
    if (decoded !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD) {
      return res.json({ success: false, message: 'Not authorized, please login again' })
    }
    next()
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

export default authAdmin
