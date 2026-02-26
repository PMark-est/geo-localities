import { z } from 'zod';
import { LocalitySchema } from './locality.interface';

export const LocalitiesResponseSchema = z.object({
    count: z.number(),
    next: z.string().nullable(),
    previous: z.string().nullable(),
    results: z.array(LocalitySchema),
});

export type LocalitiesResponse = z.infer<typeof LocalitiesResponseSchema>;