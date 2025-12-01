import { db, MediaKits } from "@repo/db";
import { and, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { EditorForm } from "@/components/editor-form";
import { getCurrentUser } from "@/lib/utils/current-user";
import { createClient } from "@/lib/utils/supabase/server";

export default async function EditorPage() {
  const supabase = await createClient();
  const user = await getCurrentUser(supabase);

  if (!user) redirect("/auth/sign-in");

  const kit = await db.query.MediaKits.findFirst({
    where: and(eq(MediaKits.userId, user.id), eq(MediaKits.default, true)),
  });

  if (!kit) redirect("/");

  return (
    <main className="min-h-screen p-4 md:p-8 max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Editor</h1>
        <p className="text-muted-foreground">Customize your media kit appearance.</p>
      </div>

      <EditorForm
        kitId={kit.id}
        initialPrimary={kit.theme.primary}
        initialRadius={kit.theme.radius}
      />
    </main>
  );
}
