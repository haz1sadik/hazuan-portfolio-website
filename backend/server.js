import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sequelize from './configs/database.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/api/server-health', (req, res) => {
  res.send('Server is healthy!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  try {
    sequelize.authenticate()
    .then(() => {
      console.log('Connected to the database.');
    })
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
});