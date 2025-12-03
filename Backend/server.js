import express from "express";
import authRoutes from "./routes/authRoutes.js";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const port = 3000;

// Middleware
app.use(express.json());



// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Mini HR Backend API', version: '1.0.0' });
});

app.use('/api/auth', authRoutes);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
