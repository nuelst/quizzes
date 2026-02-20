import { z } from 'zod';

const envSchema = z.object({
  VITE_API_URL: z.string().url(),
});

const parsed = envSchema.safeParse(import.meta.env);

if (!parsed.success) {
  console.error('Invalid front-end environment variables:', parsed.error.flatten().fieldErrors);
  throw new Error('Invalid front-end environment variables');
}

export const env = {
  VITE_API_URL: parsed.data.VITE_API_URL,
};
