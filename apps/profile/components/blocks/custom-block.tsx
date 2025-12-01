import type { CustomBlockData } from "@repo/db";
import { ArrowUpRight } from "lucide-react";

interface Props {
  data: CustomBlockData;
}

export function CustomBlock({ data }: Props) {
  const handleClick = () => {
    if (data.link) window.open(data.link, "_blank");
  };

  return (
    <button
      onClick={handleClick}
      onKeyDown={handleClick}
      type="button"
      className="block relative overflow-hidden rounded-(--radius) min-h-[160px] bg-card text-card-foreground shadow-sm border border-slate-200 group transition-transform hover:scale-[1.01]"
      style={{
        backgroundColor: data.backgroundColor,
        color: data.textColor,
      }}
    >
      {data.backgroundImage && (
        <div
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{ backgroundImage: `url(${data.backgroundImage})` }}
        />
      )}

      <div className="relative z-10 p-6 flex flex-col justify-between h-full bg-linear-to-t from-black/50 to-transparent">
        <div className="space-y-1">
          {data.title && <h3 className="text-xl font-bold leading-tight">{data.title}</h3>}
          {data.description && (
            <p className="text-sm opacity-90 leading-relaxed">{data.description}</p>
          )}
        </div>

        {data.link && (
          <div className="self-end p-2 bg-white/20 backdrop-blur-sm rounded-full">
            <ArrowUpRight className="size-4 text-white" />
          </div>
        )}
      </div>
    </button>
  );
}
