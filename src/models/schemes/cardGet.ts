import { z } from '@builder.io/qwik-city';

export const cardGetScheme = z.object({
  size: z.coerce.number().max(25).min(1),
  page: z.coerce.number(),
  sortBy: z.string(),
  sortDirection: z.enum(['asc', 'desc']),
  name: z.string(),
});
