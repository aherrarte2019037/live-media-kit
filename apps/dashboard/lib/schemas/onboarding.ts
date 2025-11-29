import { z } from "zod";

export const OnboardingUsernameSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .regex(/^[a-z0-9_]+$/, "Username must be lowercase, numbers, or underscores only")
    .transform((val) => val.toLowerCase()),
});

export type OnboardingUsernameValues = z.infer<typeof OnboardingUsernameSchema>;
