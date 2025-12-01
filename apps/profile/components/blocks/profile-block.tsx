import type { ProfileBlockData } from "@repo/db";
import type { Profile } from "@repo/db/src/schema.helpers";
import { ShieldCheck } from "lucide-react";

interface Props {
  profile: Profile;
  data: ProfileBlockData;
}

export function ProfileBlock({ profile, data }: Props) {
  return (
    <div className="text-center flex flex-col gap-2 items-center mb-4">
      <h1 className="text-2xl font-bold">@{data.displayName || profile.username}</h1>
      <div className="flex items-center gap-1 text-xs text-green-800 bg-green-200 px-3 py-1 rounded-full font-medium">
        Verified
        <ShieldCheck size={12} strokeWidth={3} />
      </div>
    </div>
  );
}
