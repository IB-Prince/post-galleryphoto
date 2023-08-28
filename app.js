const express = require('express');
const multer = require('multer');
const path = require('path');
const db = require('./db');
const Image = require('./Image');

const app = express();
const port = 3000;

// Set up static file serving
app.use(express.static(path.join(__dirname, 'public')));

// Set up middleware, routes, and other configurations here
// ...



const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Uploads will be saved in the 'uploads' directory 
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({storage: storage});
// Middleware to log requests
app.use((req, res, next) => {
    console.log(`${req.method} request to ${req.url}`);
    next();
});

// Route to handle image uploads
app.post('/upload', upload.single('image'), async (req, res)=>{
    // Handle the uploaded image and save its metadata to a database
    try{
    const imageUrl = `/uploads/${req.file.filename}`;
    const newImage = await Image.create({ imageUrl });
    res.json({ message: 'Image uploaded successfully', imageUrl});
    } catch (error) {
        console.error('Error uploading image: ', error);
        res.status(500).json({ error: 'An error occured while uploading the image' });
    }
});

// New route to fetch gallery images
app.get('/gallery', async (req, res) => {
    try {
        const images = await Image.find({}, 'imageUrl');
        res.json(images);
    } catch (error) {
        console.error('Error fetching gallery images:', error);
        res.status(500).json({ error: 'An error occured while fetching gallery images'});
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });