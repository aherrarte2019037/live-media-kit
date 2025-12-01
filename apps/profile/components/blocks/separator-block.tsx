import type { SeparatorBlockData } from "@repo/db";

interface Props {
  data: SeparatorBlockData;
}

export function SeparatorBlock({ data }: Props) {
  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold tracking-tight text-slate-900">{data.title}</h3>
    </div>
  );
}
