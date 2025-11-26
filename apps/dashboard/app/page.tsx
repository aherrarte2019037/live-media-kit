import { Button, Card } from "@repo/ui";

export default function DashboardPage() {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-4xl font-bold">Dashboard</h1>
      <p className="mt-4 text-muted-foreground">
        Creator Admin Portal - Coming soon
      </p>
      <div className="mt-8">
        <Card>
          <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Welcome</h2>
            <p className="text-muted-foreground mb-4">
              Your dashboard is ready. Start building your media kit!
            </p>
            <Button>Get Started</Button>
          </div>
        </Card>
      </div>
    </main>
  );
}
