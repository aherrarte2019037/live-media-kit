"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, FormInput } from "@repo/ui";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { createClient } from "@/lib/utils/supabase/client";
import { onboardingUsernameSchema } from "../../../lib/schemas/onboarding";

type FormData = z.infer<typeof onboardingUsernameSchema>;

export default function OnboardingPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<FormData>({
    resolver: zodResolver(onboardingUsernameSchema),
    defaultValues: {
      username: "",
    },
  });

  useEffect(() => {
    async function checkProfile() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/auth/sign-in");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("username, onboarding_completed")
        .eq("id", user.id)
        .single();

      if (profile?.onboarding_completed) {
        router.push("/");
        return;
      }

      if (profile?.username) {
        router.push("/onboarding/connect");
        return;
      }

      setIsLoading(false);
    }

    checkProfile();
  }, [router]);

  const onSubmit = async (data: FormData) => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/auth/sign-in");
      return;
    }

    // Check for duplicates
    const { data: existingUser } = await supabase
      .from("profiles")
      .select("username")
      .eq("username", data.username)
      .single();

    if (existingUser) {
      form.setError("username", { message: "Username already taken" });
      return;
    }

    // Update profile
    const { error } = await supabase
      .from("profiles")
      .update({ username: data.username })
      .eq("id", user.id);

    if (error) {
      form.setError("root", { message: "Failed to claim username" });
      return;
    }

    router.push("/onboarding/connect");
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">Claim your handle</h1>
          <p className="text-muted-foreground mt-2">Choose a unique username for your media kit.</p>
        </div>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormInput
            control={form.control}
            name="username"
            label="Username"
            placeholder="username"
          />
          {form.formState.errors.root && (
            <p className="text-sm text-red-500 font-medium">{form.formState.errors.root.message}</p>
          )}
          <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Claiming..." : "Claim Handle"}
          </Button>
        </form>
      </div>
    </div>
  );
}
