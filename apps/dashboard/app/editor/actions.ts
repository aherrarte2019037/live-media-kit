"use server";

import { db, MediaKits } from "@repo/db";
import { HexColorSchema } from "@repo/utils";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getCurrentUser } from "@/lib/utils/current-user";
import { createClient } from "@/lib/utils/supabase/server";

const UpdateThemeSchema = z.object({
  kitId: z.string().uuid(),
  primary: HexColorSchema,
  radius: z.coerce.number().min(0).max(2),
});

export type UpdateThemeState = {
  error?: string;
  success?: boolean;
};

export async function updateKitTheme(
  _prevState: UpdateThemeState,
  formData: FormData
): Promise<UpdateThemeState> {
  const supabase = await createClient();
  const user = await getCurrentUser(supabase);

  if (!user) return { error: "Unauthorized" };

  const rawData = {
    kitId: formData.get("kitId"),
    primary: formData.get("primary"),
    radius: formData.get("radius"),
  };

  const validated = UpdateThemeSchema.safeParse(rawData);
  if (!validated.success) return { error: "Invalid theme data" };

  const { kitId, primary, radius } = validated.data;

  try {
    await db
      .update(MediaKits)
      .set({
        theme: { primary, radius },
        updatedAt: new Date(),
      })
      .where(eq(MediaKits.id, kitId) && eq(MediaKits.userId, user.id));

    revalidatePath("/editor");
    return { success: true };
  } catch (err) {
    return { error: `Failed to save changes: ${err}` };
  }
}
