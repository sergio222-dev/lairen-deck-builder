import { z } from '@builder.io/qwik-city';

export const createDeckRequest = z.object({
  name: z.string(),
  description: z.string().optional(),
  isPrivate: z.boolean(),
  id: z.number().optional(),
  deck: z.array(z.object({
    id: z.number(),
    quantity: z.number(),
  })),
  side: z.array(z.object({
    id: z.number(),
    quantity: z.number(),
  })),
  treasures: z.array(z.object({
    id: z.number(),
    quantity: z.number(),
  })),
});
