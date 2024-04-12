const express = require("express");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const Student = require("./model/studentModel")

const app = express();
const port = 5000;

// Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

// Initialize Multer with the configured storage
const upload = multer({ storage });

// Enable CORS
app.use(cors());

// Handle file download
app.get('/download/:filename', (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, 'uploads', filename);

  res.download(filePath, (err) => {
    if (err) {
      res.status(500).json({ error: 'Error downloading file' });
    }
  });
});

// Serve the uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Handle file upload
app.post('/upload', upload.single('file'), async(req, res) => {

  const {name,email,contact,fileName} = req.body

  const studentData = await Student.create({
    name,
    email,
    contact,
    fileName
  });

  console.log("studentData:", studentData);

  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  res.json({ fileName: req.file.filename });
});



app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
