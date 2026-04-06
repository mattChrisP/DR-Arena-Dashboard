import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-border-subtle">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="flex flex-col items-center gap-6 text-center">
          {/* Wordmark */}
          <div className="flex items-center gap-2 text-sm font-semibold tracking-tight">
            <span className="font-display text-[19px] leading-none">DR</span>
            <span className="text-accent/60 text-sm font-light leading-none">-</span>
            <span className="text-[11px] font-bold tracking-[0.2em] uppercase leading-none">Arena</span>
          </div>

          {/* Links row */}
          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-fg-muted">
            <Link href="/leaderboard" className="hover:text-fg transition-colors">Leaderboard</Link>
            <Link href="/models" className="hover:text-fg transition-colors">Models</Link>
            <Link href="/battles" className="hover:text-fg transition-colors">Battles</Link>
            <Link href="/dataset" className="hover:text-fg transition-colors">Dataset</Link>
            <Link href="/methodology" className="hover:text-fg transition-colors">Methodology</Link>
            <a href="https://arxiv.org/abs/2601.10504" target="_blank" rel="noopener noreferrer" className="hover:text-fg transition-colors">Paper</a>
            <a href="https://github.com/iNLP-Lab/DR-Arena" target="_blank" rel="noopener noreferrer" className="hover:text-fg transition-colors">GitHub</a>
          </nav>

          {/* Copyright */}
          <p className="text-[11px] text-fg-dim">
            © 2026 DR-Arena · SUTD iNLP Lab
          </p>
        </div>
      </div>
    </footer>
  );
}
