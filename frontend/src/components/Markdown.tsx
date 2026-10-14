import type { ReactNode } from "react";

// A small, safe renderer for the subset of markdown Claude tends to reply with
// (paragraphs, bold, lists, pipe tables). Renders to React elements rather than
// HTML, so all text is auto-escaped — assistant replies can quote untrusted
// third-party job posting text, so raw HTML injection must stay impossible.

function renderInline(text: string): ReactNode[] {
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return parts.map((part, i) => (i % 2 === 1 ? <strong key={i}>{part}</strong> : part));
}

function isTableRow(line: string) {
  return line.trim().startsWith("|") && line.trim().endsWith("|");
}

function isTableSeparator(line: string) {
  return /^\|?[\s:|-]+\|?$/.test(line.trim()) && line.includes("-");
}

function splitRow(line: string): string[] {
  return line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((cell) => cell.trim());
}

export function Markdown({ text }: { text: string }) {
  const lines = text.split("\n");
  const blocks: ReactNode[] = [];
  let i = 0;
  let key = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.trim() === "") {
      i++;
      continue;
    }

    if (isTableRow(line) && isTableSeparator(lines[i + 1] ?? "")) {
      const header = splitRow(line);
      i += 2;
      const rows: string[][] = [];
      while (i < lines.length && isTableRow(lines[i])) {
        rows.push(splitRow(lines[i]));
        i++;
      }
      blocks.push(
        <table key={key++} className="chat-table">
          <thead>
            <tr>
              {header.map((cell, c) => (
                <th key={c}>{renderInline(cell)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, r) => (
              <tr key={r}>
                {row.map((cell, c) => (
                  <td key={c}>{renderInline(cell)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>,
      );
      continue;
    }

    if (/^[-*]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^[-*]\s+/, ""));
        i++;
      }
      blocks.push(
        <ul key={key++}>
          {items.map((item, idx) => (
            <li key={idx}>{renderInline(item)}</li>
          ))}
        </ul>,
      );
      continue;
    }

    const paragraph: string[] = [line];
    i++;
    while (i < lines.length && lines[i].trim() !== "" && !isTableRow(lines[i]) && !/^[-*]\s+/.test(lines[i])) {
      paragraph.push(lines[i]);
      i++;
    }
    blocks.push(<p key={key++}>{renderInline(paragraph.join(" "))}</p>);
  }

  return <>{blocks}</>;
}
