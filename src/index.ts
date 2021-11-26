import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import mongoose from 'mongoose';
import cookieSession from 'cookie-session';

import { currentUserRouter } from './routes/currentuser';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';
import { errorHandler } from './middlewares/errorHandler';
import { NotFoundError } from './errors/notFoundError';

const port = process.env.PORT || '5000';
const jwt = process.env.JWT_SECRET || 'secret';
const mongo_db = process.env.MONGO_URI || 'mongodb://localhost:27017/auth';
const app = express();

app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: true,
  })
);

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);
app.use(errorHandler);

// For routes that does not exist
app.all('*', () => {
  throw new NotFoundError();
});

const start = async () => {
  if (!jwt) {
    throw new Error('JWT_SECRET must be defined');
  }
  if (!mongo_db) {
    throw new Error('MONGO_URI must be defined');
  }
  try {
    await mongoose.connect(mongo_db);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error(error);
  }
  app.listen(port, () => {
    console.log(`Listening on localhost:${port}`);
  });
};

start();
