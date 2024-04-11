const express = require("express");
const multer = require("multer");
const path = require("path");
const cors = require("cors");

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

  console.log(filename,"file name:")
  const filePath = path.join(__dirname, 'uploads', filename);

  console.log(filePath,"file path")

  res.download(filePath, (err) => {
    if (err) {
      console.error('Error downloading file:', err);
      res.status(500).json({ error: 'Error downloading file' });
    }
  });
});

// Serve the uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Handle file upload
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  res.json({ fileName: req.file.filename });
});



app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
