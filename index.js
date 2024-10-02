import express from 'express';
import cors from 'cors';
import { serachRouter } from './routes/searchRoutes.js';
const app = express();

// Allowing all origins for the assignment
app.use(cors());

app.get('/', function (req, res) {
  res.send('Flight Search Page.');
});
app.use('/search', serachRouter);

app.listen(3000);
