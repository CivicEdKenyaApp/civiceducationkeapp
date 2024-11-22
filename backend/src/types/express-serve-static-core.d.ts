import { ParsedQs } from 'qs';
import { Db } from 'mongodb';

declare module 'express-serve-static-core' {
  interface Request {
    db: Db;
  }

  interface Query extends ParsedQs {
    type?: 'PDF' | 'Video' | 'Infographic' | 'Article';
  }
} 