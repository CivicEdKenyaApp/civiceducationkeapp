import { z } from 'zod';

declare module 'zod' {
  export = z;
  export as namespace z;
}

// Add explicit type exports
export type {
  ZodType,
  ZodString,
  ZodNumber,
  ZodBoolean,
  ZodArray,
  ZodObject,
  ZodEnum,
  ZodError,
  infer as zodInfer
} from 'zod';
