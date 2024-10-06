const express = require('express');
const bodyParser = require('body-parser');
const empRoutes = require('./routes/empRoutes');
const path = require('path');
const cors = require('cors');
const connectDB = require('./config/db');
require('dotenv').config();


const app = express();
const PORT = process.env.PORT || 5000;


// Middleware
app.use(cors());
app.use('/uploads',express.static(path.join(__dirname, 'uploads')));
app.use(bodyParser.json());
app.use('/api', empRoutes);

connectDB();
// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


   