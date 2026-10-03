"use client";

import { FileText } from "lucide-react";

interface Section {
  id: string;
  title: string;
}

interface LegalTocProps {
  title?: string;
  sections: Section[];
}

export function LegalToc({ title = "Table of Contents", sections }: LegalTocProps) {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="bg-white border border-[#DFD5C6] rounded-none p-6 shadow-xs">
      <h3 className="text-xs font-bold uppercase tracking-wider text-[#50644C] flex items-center gap-2 mb-4">
        <FileText className="w-4 h-4 text-emerald-700" />
        {title}
      </h3>
      <nav className="space-y-1 text-xs">
        {sections.map((section) => (
          <button
            key={section.id}
            type="button"
            onClick={() => scrollToSection(section.id)}
            className="w-full text-left block py-1.5 px-2.5 rounded-none text-[#5A6659] hover:text-[#50644C] hover:bg-[#EDF2EB]/50 transition-colors font-medium cursor-pointer"
          >
            {section.title}
          </button>
        ))}
      </nav>
    </div>
  );
}

export function ScrollToButton({
  targetId,
  children,
  className,
}: {
  targetId: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => {
        const el = document.getElementById(targetId);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }}
      className={className}
    >
      {children}
    </button>
  );
}
