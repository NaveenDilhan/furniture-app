const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const designRoutes = require('./routes/designRoutes');
const assetRoutes = require('./routes/assetRoutes');
const furnitureRoutes = require('./routes/furnitureRoutes'); 

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/designs', designRoutes);
app.use('/api/assets', assetRoutes);
app.use('/api/furniture', furnitureRoutes); 

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));