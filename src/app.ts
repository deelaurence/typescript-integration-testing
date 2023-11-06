import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import authRoutes from './routes/auth';
import { Secret } from 'jsonwebtoken';
import  dotenv from 'dotenv'
dotenv.config()


const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use('/auth', authRoutes);

mongoose.connect(process.env.MONGODB_URI||"mongodb://localhost:27017/user-auth");

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
