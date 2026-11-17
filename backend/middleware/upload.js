import multer from 'multer'
import path from 'path'

// save uploaded images to the uploads folder with a unique name
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname)
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1e6) + ext)
  }
})

const upload = multer({ storage })

export default upload
