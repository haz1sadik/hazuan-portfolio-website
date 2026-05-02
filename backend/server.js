import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import routes from './routes/index.route.js';
import { sequelize } from './models/index.model.js';

import Admin from './models/Admin.model.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:3000',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use("/api", routes);

// Health Check Routes
app.get('/api/server-health', (req, res) => {
  res.send('Server is healthy!');
});
app.get('/api/database-health', async (req, res) => {
  try {
    await sequelize.authenticate();
    res.send('Database is healthy!');
  } catch (error) {
    console.error('Error connecting to the database:', error);
    res.status(500).send('Database is not healthy!');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  try {
    sequelize.authenticate()
      .then(async () => {
        console.log('Connected to the database.');
        sequelize.sync({ alter: false })
          .then(async () => {
            console.log('Database synced successfully.');
          })
          .catch((err) => {
            console.error('Error syncing Database:', err);
          });
      });
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
});