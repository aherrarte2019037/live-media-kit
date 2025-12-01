"use server";

import { db, Profiles } from "@repo/db";
import { eq } from "drizzle-orm";

export async function getCreatorEmail(profileId: string) {
  const profile = await db.query.Profiles.findFirst({
    where: eq(Profiles.id, profileId),
    columns: {
      email: true,
    },
  });

  if (!profile) return { error: "Email not found" };

  return { email: profile.email };
}
