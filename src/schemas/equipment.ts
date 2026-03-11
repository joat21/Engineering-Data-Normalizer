import z from "zod";

export const saveFromStagingSchema = z.object({
  body: z.object({
    sessionId: z.uuid(),
  }),
});
