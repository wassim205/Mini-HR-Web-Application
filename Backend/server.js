import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import dotenv from "dotenv";
import { authenticateToken, requireRole } from "./middleware/auth.js";

dotenv.config();
const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Mini HR Backend API', version: '1.0.0' });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// example for a protected route
app.get('/api/test', authenticateToken, requireRole(['employee']), (req, res) => {
  res.json({ message: 'This is a protected route' });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
