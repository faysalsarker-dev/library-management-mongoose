import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db";
import errorHandler from "./middleware/errorHandler";
import bookRoutes from "./routes/book.routes"
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(errorHandler);
// Test route
app.get("/", (_req, res) => {
  res.send("API is running...");
});

app.use('/api/books',bookRoutes)




connectDB().then(() => {
  app.listen(port, () => {
    console.log(`🚀 Server started on http://localhost:${port}`);
  });
});
