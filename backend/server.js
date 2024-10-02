require('dotenv').config(); // Load environment variables

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dashboardRoutes = require('./routes/dashboardRoutes'); 
const formRoutes = require('./routes/formRoutes'); 
const userRoutes = require('./routes/auth'); 
const uploadRoutes = require('./routes/uploadRoutes'); 
const responseRoutes = require('./routes/responseRoutes');


const app = express();
app.use(cors({ origin: 'http://localhost:3000', credentials: true, }));
app.use(express.json());

// URL encode the password
const encodedURI = process.env.DB_URI.replace('@25', '%4025');

// Log the encoded DB_URI to verify it's being loaded correctly
console.log('DB_URI:', encodedURI);

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', dashboardRoutes);

// Connect to the database
const connectDB = async () => {
    try {
        await mongoose.connect(encodedURI, {
            serverSelectionTimeoutMS: 30000
        });
        console.log("CONNECTED TO DATABASE SUCCESSFULLY");
    } catch (error) {
        console.error('COULD NOT CONNECT TO DATABASE:', error.message);
        process.exit(1); // Exit process with failure
    }
};

connectDB(); // Call the function to connect to the database

// Simple route
app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use('/api/forms', formRoutes);
app.use('/api/users', userRoutes);
app.use('/api/images', uploadRoutes);
app.use('/api/responses', responseRoutes);
app.use('/uploads', express.static('uploads'));


const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


