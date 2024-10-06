import { z } from 'zod';

export const body = z.object({ description: z.string() });
export type Body = z.infer<typeof body>;