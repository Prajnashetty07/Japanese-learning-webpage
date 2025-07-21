// File: app/page.tsx
"use client";
import Link from "next/link";
import { useGameStore } from "@/lib/store";
import { Star, Lock } from "lucide-react";

const levels = [
  { id: "easy", name: "Easy", color: "bg-green-500" },
  { id: "medium", name: "Medium", color: "bg-yellow-400" },
  { id: "hard", name: "Hard", color: "bg-red-500" },
];

export default function HomePage() {
  const progress = useGameStore((s) => s.progress);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-200 to-white">
      <h1 className="text-4xl font-bold mb-6">🎯 Jumbled Word Game</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {levels.map((lvl) => {
          const stars = progress[lvl.id] || 0;
          const isLocked = lvl.id !== "easy" && (progress.easy || 0) < 15 && lvl.id === "medium" || (progress.medium || 0) < 15 && lvl.id === "hard";

          return (
            <Link
              key={lvl.id}
              href={isLocked ? "#" : `/game/${lvl.id}`}
              className={`rounded-xl p-6 text-white shadow-md flex flex-col items-center gap-3 transition-transform duration-300 hover:scale-105 ${lvl.color} ${isLocked && "opacity-50 pointer-events-none"}`}
            >
              <div className="text-2xl font-semibold">{lvl.name}</div>
              <div className="flex items-center gap-1">
                {isLocked ? <Lock className="w-6 h-6" /> : Array.from({ length: 3 }, (_, i) => (
                  <Star key={i} className={`w-5 h-5 ${i < Math.floor(stars / 8 * 3) ? "fill-white" : "fill-transparent"}`} />
                ))}
              </div>
              <div className="text-sm">{stars}/24 Stars</div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
