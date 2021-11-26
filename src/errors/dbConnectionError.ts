import { ValidationError } from 'express-validator';
import { CustomError } from './customError';

export class DbConnectionError extends CustomError {
  statusCode = 500;
  reason = 'Error connecting to database';
  constructor() {
    super('Error connecting to database');
    Object.setPrototypeOf(this, DbConnectionError.prototype);
  }
  serializeErrors() {
    return [{ message: this.reason }];
  }
}
