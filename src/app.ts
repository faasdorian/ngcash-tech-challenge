import express from 'express';
import helloRoutes from './routes/hello';

const app = express();
app.use('/hello', helloRoutes);

app.listen(3000);