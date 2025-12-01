"use client";

import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label } from "@repo/ui";
import { Loader2 } from "lucide-react";
import { useActionState, useState } from "react";
import { type UpdateThemeState, updateKitTheme } from "@/app/editor/actions";

interface EditorFormProps {
  kitId: string;
  initialPrimary: string;
  initialRadius: number;
}

const initialState: UpdateThemeState = {};

export function EditorForm({ kitId, initialPrimary, initialRadius }: EditorFormProps) {
  const [state, action, isPending] = useActionState(updateKitTheme, initialState);
  const [primary, setPrimary] = useState(initialPrimary);
  const [radius, setRadius] = useState(initialRadius);

  return (
    <form action={action}>
      <input type="hidden" name="kitId" value={kitId} />
      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="primary">Primary Color</Label>
              <div className="flex gap-3 items-center">
                <Input
                  type="color"
                  name="primary"
                  id="primary"
                  value={primary}
                  onChange={(e) => setPrimary(e.target.value)}
                  className="w-16 h-10 p-1 cursor-pointer"
                />
                <Input type="text" value={primary} readOnly className="font-mono uppercase w-28" />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <Label htmlFor="radius">Corner Radius</Label>
                <span className="text-xs text-muted-foreground font-mono">{radius}rem</span>
              </div>
              <Input
                type="range"
                name="radius"
                id="radius"
                min="0"
                max="2"
                step="0.125"
                value={radius}
                onChange={(e) => setRadius(Number(e.target.value))}
                className="cursor-pointer"
              />
            </div>

            <Button type="submit" disabled={isPending} className="w-full">
              {isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
              Save Changes
            </Button>

            {state.success && (
              <p className="text-sm text-green-600 text-center">Theme updated successfully!</p>
            )}
            {state.error && <p className="text-sm text-destructive text-center">{state.error}</p>}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Label>Live Preview</Label>

          <div
            className="border rounded-xl p-6 shadow-sm bg-slate-50 dark:bg-slate-950 transition-all duration-200"
            style={{
              ["--radius" as string]: `${radius}rem`,
              ["--primary" as string]: primary,
            }}
          >
            <div className="max-w-xs mx-auto space-y-4">
              <div className="text-center">
                <div className="size-16 bg-slate-200 rounded-full mx-auto mb-2" />
                <div className="h-6 w-32 bg-slate-200 rounded mx-auto" />
              </div>

              <button
                type="button"
                className="w-full h-10 px-4 py-2 flex items-center justify-center rounded-(--radius) bg-primary text-white font-medium shadow-sm transition-colors"
              >
                Work With Me
              </button>

              <div className="grid grid-cols-2 gap-3">
                <div className="h-24 bg-white dark:bg-slate-900 border rounded-(--radius) p-4 shadow-sm" />
                <div className="h-24 bg-white dark:bg-slate-900 border rounded-(--radius) p-4 shadow-sm" />
              </div>
            </div>
          </div>
          <p className="text-xs text-muted-foreground text-center">
            This is how your kit will look to brands.
          </p>
        </div>
      </div>
    </form>
  );
}
