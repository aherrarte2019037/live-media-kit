"use client";

import type { CustomBlockData } from "@repo/db";
import { ArrowUpRight } from "lucide-react";

interface Props {
  data: CustomBlockData;
}

export function CustomBlock({ data }: Props) {
  const isLink = !!data.link;

  const handleClick = () => {
    if (isLink) window.open(data.link, "_blank");
  };

  return (
    <button
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") handleClick();
      }}
      type="button"
      className="block w-full relative overflow-hidden rounded-3xl min-h-[130px] bg-card text-card-foreground shadow-sm border border-border/50 group transition-all hover:scale-[1.02] hover:shadow-md"
      style={{
        backgroundColor: data.backgroundColor,
        color: data.textColor,
        cursor: isLink ? "pointer" : "default",
      }}
    >
      {data.backgroundImage && (
        <div
          className="absolute inset-0 bg-cover bg-center z-0 transition-transform duration-500 group-hover:scale-105"
          style={{ backgroundImage: `url(${data.backgroundImage})` }}
        />
      )}

      <div className="relative z-10 p-5 flex flex-col items-start justify-center h-full min-h-[130px] text-left">
        <div className="space-y-1.5 w-full">
          {data.title && (
            <h3 className="text-xl font-bold leading-tight tracking-tight">{data.title}</h3>
          )}
          {data.description && (
            <p className="text-base opacity-90 leading-relaxed font-medium">{data.description}</p>
          )}
        </div>

        {data.link && (
          <div className="absolute top-4 right-4 p-2 bg-black/10 dark:bg-white/10 backdrop-blur-md rounded-full transition-colors group-hover:bg-black/20 dark:group-hover:bg-white/20">
            <ArrowUpRight className="size-5" />
          </div>
        )}
      </div>
    </button>
  );
}
