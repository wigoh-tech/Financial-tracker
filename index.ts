import express from 'express';

import helmet from 'helmet';
import dotenv from 'dotenv';
import categoryRoutes from './routes/categories';
import transactionRoutes from './routes/transactions';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;


app.use(helmet());
app.use(express.json());

app.use('/api/categories', categoryRoutes);
app.use('/api/transactions', transactionRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
