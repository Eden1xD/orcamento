"use client";

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="inline-flex h-10 items-center gap-2 rounded-md bg-ink px-5 text-[13px] font-medium text-ice transition-colors hover:bg-cobalt"
    >
      <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
        <path d="M4 5.5V1.5h6v4M4 10.5H2.5A1 1 0 011.5 9.5v-3a1 1 0 011-1h9a1 1 0 011 1v3a1 1 0 01-1 1H10M4 8h6v4.5H4V8z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
      </svg>
      Baixar PDF
    </button>
  );
}
