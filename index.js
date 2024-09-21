import express from 'express';
import { serachRouter } from './routes/searchRoutes.js';
const app = express();

app.get('/', function (req, res) {
  res.send('Hello World');
});
app.use('/search', serachRouter);

app.listen(3000);
