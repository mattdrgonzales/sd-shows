import { Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-border py-6">
      <div className="flex flex-col items-center justify-between gap-2 text-xs text-[#666666] sm:flex-row">
        <span>
          Built by Matt Gonzales
        </span>
        <div className="flex items-center gap-4">
          <span>Data refreshed hourly from 15 venues</span>
          <a
            href="https://www.linkedin.com/in/mattrgonzales/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 transition-colors duration-150 hover:text-foreground"
          >
            <Linkedin className="size-3" />
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
}
