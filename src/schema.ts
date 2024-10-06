import { z } from 'zod';

export const newForm = z.object({ name: z.string() });

export const updateForm = z.object({ content: z.string() });
