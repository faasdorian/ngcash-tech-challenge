import express from 'express';
import authRoutes from './routes/auth';

const app = express();
app.use(express.json());
app.use('/auth', authRoutes);

app.listen(3000);