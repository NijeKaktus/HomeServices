import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import { connectDB, disconnectDB } from './lib/prisma';
import categoriesRouter from './routes/categories';
import serviceProvidersRouter from './routes/serviceProviders';
import authRouter from './routes/auth';
import messagesRouter from './routes/messages';
import reviewsRouter from './routes/reviews';
import adminRouter from './routes/admin';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api/categories', categoriesRouter);
app.use('/api/service-providers', serviceProvidersRouter);
app.use('/api/auth', authRouter);
app.use('/api/messages', messagesRouter);
app.use('/api/reviews', reviewsRouter);
app.use('/api/admin', adminRouter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend server is running' });
});

const startServer = async () => {
  try {
    await connectDB();

    const server = app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });

    process.on('SIGTERM', async () => {
      console.log('SIGTERM primljen, zatvaraju se servisi...');
      server.close(async () => {
        await disconnectDB();
        process.exit(0);
      });
    });

    process.on('SIGINT', async () => {
      console.log('\nSIGINT primljen, zatvaraju se servisi...');
      server.close(async () => {
        await disconnectDB();
        process.exit(0);
      });
    });

  } catch (error) {
    console.error('Greška pri pokretanju servera:', error);
    process.exit(1);
  }
};

startServer();

export default app;