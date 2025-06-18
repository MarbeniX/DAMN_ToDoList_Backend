import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import listRoutes from './routes/listRoutes';
import authRoutes from './routes/authRoutes';

//Database connection
dotenv.config();
connectDB();
const app = express();

//Able to parse JSON data
app.use(express.json());

//Routes
app.use('/api/lists', listRoutes)
app.use('/api/auth', authRoutes)
export default app 