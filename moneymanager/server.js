import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { sequelize } from './models/index.js';
import authRouter from './routes/auth.js';
import profileRouter from './routes/profile.js';
import categoriesRouter from './routes/categories.js';
import incomesRouter from './routes/incomes.js';
import expensesRouter from './routes/expenses.js';
import dashboardRouter from './routes/dashboard.js';
import filterRouter from './routes/filter.js';
import excelRouter from './routes/excel.js';
import emailRouter from './routes/email.js';
import subscriptionsRouter from './routes/subscriptions.js';
import { errorHandler } from './middleware/errorHandler.js';
import { initScheduledJobs } from './services/notificationService.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Authorization', 'Content-Type', 'Accept']
}));

app.use(express.json());

const apiRouter = express.Router();

apiRouter.use('/', authRouter);
apiRouter.use('/', profileRouter);
apiRouter.use('/', categoriesRouter);
apiRouter.use('/', incomesRouter);
apiRouter.use('/', expensesRouter);
apiRouter.use('/', dashboardRouter);
apiRouter.use('/', filterRouter);
apiRouter.use('/', subscriptionsRouter);
apiRouter.use('/excel', excelRouter);
apiRouter.use('/email', emailRouter);

app.use('/api/v1.0', apiRouter);

app.get('/', (req, res) => {
  res.send('Application is running');
});

app.use(errorHandler);

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully.');

    // Auto-migrate missing columns for existing database.sqlite tables
    try {
      await sequelize.query("ALTER TABLE tbl_profiles ADD COLUMN currency VARCHAR(10) DEFAULT 'INR';");
    } catch (e) {
      // Column already exists
    }

    try {
      await sequelize.query("ALTER TABLE tbl_categories ADD COLUMN budget DECIMAL(15,2) DEFAULT 0;");
    } catch (e) {
      // Column already exists
    }

    await sequelize.sync();
    console.log('Database synced.');

    initScheduledJobs();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT} with base path /api/v1.0`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
  }
};

startServer();
