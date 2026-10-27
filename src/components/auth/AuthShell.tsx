import type { ReactNode } from "react";
import { Wordmark } from "@/components/ui";
import { Reveal } from "@/components/motion";

export default function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 grid-lines opacity-40" />
      <div
        className="absolute left-1/2 top-10 h-[360px] w-[600px] -translate-x-1/2 rounded-full opacity-15 blur-[140px]"
        style={{ background: "radial-gradient(circle,#245BFF 0%,transparent 65%)" }}
      />
      <div className="relative mx-auto flex min-h-[calc(100vh-80px)] max-w-md flex-col justify-center px-5 py-16 sm:px-0">
        <Reveal>
          <div className="rounded-lg border border-line bg-charcoal/80 p-8 backdrop-blur sm:p-10">
            <Wordmark className="text-ice" />
            {children}
          </div>
        </Reveal>
      </div>
    </div>
  );
}
