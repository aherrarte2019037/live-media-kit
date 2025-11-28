import { Button } from "@repo/ui";
import { signOut } from "./auth/actions";

export default function DashboardPage() {
  return (
    <main className="min-h-screen p-8 flex flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-bold">Creator Dashboard</h1>
      <p className="text-muted-foreground">Welcome to Kyt.</p>

      <form action={signOut}>
        <Button variant="destructive">Sign Out</Button>
      </form>
    </main>
  );
}
