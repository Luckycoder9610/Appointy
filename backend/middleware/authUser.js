import jwt from 'jsonwebtoken'

// checks the user token sent in the "token" header
const authUser = (req, res, next) => {
  try {
    const { token } = req.headers
    if (!token) {
      return res.json({ success: false, message: 'Not authorized, please login again' })
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.userId = decoded.id
    next()
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

export default authUser
