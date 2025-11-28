import { Button } from "@repo/ui";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/utils/supabase/server";
import { signOut } from "./auth/actions";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/sign-in");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("onboarding_completed")
    .eq("id", user.id)
    .single();

  if (!profile?.onboarding_completed) {
    redirect("/onboarding/username");
  }

  return (
    <main className="min-h-screen p-8 flex flex-col items-center justify-center gap-4">
      <h1>Template</h1>
      <form action={signOut}>
        <Button variant="destructive">Sign Out</Button>
      </form>
    </main>
  );
}
