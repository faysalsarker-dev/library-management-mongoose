import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db";
import errorHandler from "./middleware/errorHandler";
import bookRoutes from "./routes/book.routes"
import borrowRoutes from "./routes/borrow.routes"
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(errorHandler);







app.use('/api/books',bookRoutes)
app.use('/api/borrow', borrowRoutes);


// Test route
app.get("/", (_req, res) => {
  res.send("API is running...");
});
connectDB().then(() => {
  app.listen(port, () => {
    console.log(`🚀 Server started on http://localhost:${port}`);
  });
});
