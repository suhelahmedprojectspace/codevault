import { z } from 'zod';

export const SignupSchema = z.object({
  email: z.string().email('Invalid email format'),
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username cannot exceed 20 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'No specail characters expect underscores'),
  password: z
    .string()
    .min(8, 'Passwor must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain at least on uppercase letter')
    .regex(/[0-9]/, 'Must contain at least one number'),
});
