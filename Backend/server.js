import express from "express";

const app = express();
const port = 3000;

// Middleware
app.use(express.json());



// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Mini HR Backend API', version: '1.0.0' });
});


app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});