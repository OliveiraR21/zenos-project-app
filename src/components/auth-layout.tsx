import Image from "next/image";
import type React from "react";

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="absolute top-8 flex items-center gap-2">
        <Image src="/zenos_sem_fundo_claro.png" alt="Zenos Logo" width={24} height={24} />
        <span className="font-display text-3xl tracking-wider text-foreground">Zenos</span>
      </div>
      <main className="w-full max-w-md">
        {children}
      </main>
    </div>
  );
}
