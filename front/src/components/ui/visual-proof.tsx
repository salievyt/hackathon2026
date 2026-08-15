"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

const KEYWORDS = new Set([
  "from", "import", "async", "def", "await", "return",
  "if", "else", "elif", "class", "const", "let", "function",
  "type", "interface", "export", "default", "go", "func",
  "package", "var", "select", "case", "switch", "for", "in",
  "new", "true", "false", "None",
]);

const FILES: Record<string, string> = {
  "main.py": `from fastapi import FastAPI, Depends
import neural_engine

app = FastAPI(title="Hackathon API")

@app.post("/api/v1/analyze")
async def analyze_data(payload: dict):
    # Process complex dataset in O(1) time
    result = await neural_engine.compute(payload)

    return {
        "status": "success",
        "accuracy": 99.99,
        "data": result
    }`,
  "api.ts": `import { createServer } from "node:http";

export const engine = {
    async analyze(payload: unknown) {
        const result = await fetch("/api/v1/analyze", {
            method: "POST",
            body: JSON.stringify(payload),
        });
        return result.json();
    },
};`,
  "utils.go": `package engine

type Engine struct {
    Model  string
    Weight float64
}

func (e *Engine) Compute(data []float64) float64 {
    var acc float64
    for _, v := range data {
        acc += v * e.Weight
    }
    return acc / float64(len(data))
}`,
  "Dockerfile": `FROM python:3.14-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]`,
  ".gitignore": `__pycache__/
node_modules/
.venv/
*.pyc
.env
.DS_Store
dist/`,
};

type SidebarEntry = {
  label: string;
  file?: string;
  depth: number;
};

const SIDEBAR: SidebarEntry[] = [
  { label: "▶ src", depth: 0 },
  { label: "main.py", file: "main.py", depth: 1 },
  { label: "api.ts", file: "api.ts", depth: 1 },
  { label: "utils.go", file: "utils.go", depth: 1 },
  { label: "▶ tests", depth: 0 },
  { label: "▶ docs", depth: 0 },
  { label: ".gitignore", file: ".gitignore", depth: 0 },
  { label: "Dockerfile", file: "Dockerfile", depth: 0 },
];

const TOKEN_PATTERN = /(".*?"|'[^']*'|#[^\n]*|\b[A-Za-z_][A-Za-z0-9_]*\b)/g;

function highlight(tokens: React.ReactNode[], line: string, lineKey: number) {
  const parts = line.split(TOKEN_PATTERN).filter(Boolean);
  return parts.map((part, i) => {
    const key = `${lineKey}-${i}`;
    if (part.startsWith('"') || part.startsWith("'")) {
      return (
        <span key={key} className="text-[#19B86B]">
          {part}
        </span>
      );
    }
    if (part.startsWith("#")) {
      return (
        <span key={key} className="text-on-dark-muted">
          {part}
        </span>
      );
    }
    if (KEYWORDS.has(part)) {
      return (
        <span key={key} className="text-primary-on-dark">
          {part}
        </span>
      );
    }
    return part;
  });
}

export function VisualProof() {
  const [openTabs, setOpenTabs] = useState<string[]>(["main.py", "api.ts"]);
  const [activeFile, setActiveFile] = useState("main.py");

  const openFile = (file: string) => {
    setOpenTabs((tabs) => (tabs.includes(file) ? tabs : [...tabs, file]));
    setActiveFile(file);
  };

  const closeTab = (file: string) => {
    const next = openTabs.filter((tab) => tab !== file);
    setOpenTabs(next);
    if (activeFile === file) {
      setActiveFile(next[next.length - 1] ?? "");
    }
  };

  const content = FILES[activeFile] ?? "";
  const lines = content ? content.split("\n") : [];

  return (
    <div className="mt-20 w-full max-w-[1024px] rounded-xl bg-surface-dark text-on-dark border border-border-on-dark shadow-floating overflow-hidden text-left flex flex-col">
      <div className="h-12 border-b border-border-on-dark bg-surface-dark-2 flex items-center px-4 gap-4">
        <div className="flex gap-2 shrink-0">
          <div className="w-3 h-3 rounded-full bg-border-on-dark"></div>
          <div className="w-3 h-3 rounded-full bg-border-on-dark"></div>
          <div className="w-3 h-3 rounded-full bg-border-on-dark"></div>
        </div>
        <div className="flex gap-1 overflow-x-auto">
          {openTabs.map((file) => (
            <button
              key={file}
              type="button"
              onClick={() => setActiveFile(file)}
              className={cn(
                "group flex items-center gap-2 px-4 py-1.5 text-caption rounded-t-md border border-b-0 relative top-[1px] transition-colors",
                activeFile === file
                  ? "bg-surface-dark text-on-dark border-border-on-dark"
                  : "text-on-dark-muted border-transparent hover:text-on-dark"
              )}
            >
              {file}
              <span
                role="button"
                aria-label={`Close ${file}`}
                onClick={(e) => {
                  e.stopPropagation();
                  closeTab(file);
                }}
                className="text-on-dark-muted/60 hover:text-on-dark text-xs leading-none"
              >
                ×
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row min-h-[400px]">
        <div className="hidden md:block w-48 border-r border-border-on-dark bg-surface-dark-3 p-4">
          <div className="text-eyebrow text-on-dark-muted mb-4">EXPLORER</div>
          <ul className="space-y-2 text-caption font-mono">
            {SIDEBAR.map((entry) =>
              entry.file ? (
                <li key={entry.label}>
                  <button
                    type="button"
                    onClick={() => openFile(entry.file!)}
                    style={{ paddingLeft: 12 + entry.depth * 16 }}
                    className={cn(
                      "w-full text-left rounded transition-colors",
                      activeFile === entry.file
                        ? "text-on-dark bg-border-on-dark/40"
                        : "text-on-dark-muted hover:text-on-dark"
                    )}
                  >
                    {entry.label}
                  </button>
                </li>
              ) : (
                <li
                  key={entry.label}
                  style={{ paddingLeft: 12 + entry.depth * 16 }}
                  className="text-on-dark-muted select-none"
                >
                  {entry.label}
                </li>
              )
            )}
          </ul>
        </div>

        <div className="flex-1 p-6 font-mono text-sm leading-relaxed overflow-auto">
          <div className="text-on-dark-muted mb-4"># Hackathon 2026 Core Logic Engine</div>
          {lines.map((line, i) => (
            <div key={i} className="flex">
              <div className="text-on-dark-muted/50 text-right pr-4 select-none w-8 shrink-0">
                {i + 1}
              </div>
              <div className="whitespace-pre text-on-dark">{highlight([], line, i)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
