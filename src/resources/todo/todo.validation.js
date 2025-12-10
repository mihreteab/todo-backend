import { z } from "zod";

const create = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  completed: z.boolean().optional(),
});

export { create };