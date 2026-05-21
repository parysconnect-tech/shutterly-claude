// Light-weight markdown renderer for lesson bodies.
//
// Supports:
//   **bold**       *italic*       `code`
//   paragraphs, blank-line separated
//   - / * unordered lists
//   1. / 2. ordered lists
//   > blockquote
//   ![caption](src)               → <LessonImage />
//   [[diagram:NAME]]              → <Diagram which="NAME" />  (block-level)
//   [[pullquote: "text" — by]]    → big highlighted pull quote
//
// Image and diagram tokens MUST sit on their own line.

import * as React from 'react';
import { LessonImage } from './LessonImage';
import { Diagram } from './diagrams';
import { cn } from '@/lib/utils';

type Node =
  | { kind: 'p'; html: string }
  | { kind: 'ul' | 'ol'; items: string[] }
  | { kind: 'quote'; html: string }
  | { kind: 'image'; src: string; caption: string }
  | { kind: 'diagram'; name: string }
  | { kind: 'pullquote'; text: string; attribution?: string };

function inline(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code class="rounded bg-muted px-1 py-0.5 text-[0.9em]">$1</code>');
}

function parse(md: string): Node[] {
  const out: Node[] = [];
  const lines = md.split(/\r?\n/);
  let listType: 'ul' | 'ol' | null = null;
  let listItems: string[] = [];
  let buf: string[] = [];

  const flushList = () => {
    if (listType && listItems.length) {
      out.push({ kind: listType, items: listItems });
    }
    listType = null;
    listItems = [];
  };
  const flushPara = () => {
    if (buf.length) {
      out.push({ kind: 'p', html: inline(buf.join(' ')) });
      buf = [];
    }
  };
  const flushAll = () => {
    flushList();
    flushPara();
  };

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) {
      flushAll();
      continue;
    }

    // Image: ![caption](src)
    const img = line.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (img) {
      flushAll();
      out.push({ kind: 'image', caption: img[1], src: img[2] });
      continue;
    }

    // Diagram: [[diagram:name]]
    const diag = line.match(/^\[\[diagram:([a-z0-9-]+)\]\]$/i);
    if (diag) {
      flushAll();
      out.push({ kind: 'diagram', name: diag[1] });
      continue;
    }

    // Pullquote: [[pullquote: "text" — Attribution]]
    const pull = line.match(/^\[\[pullquote:\s*(.+?)\]\]$/);
    if (pull) {
      flushAll();
      const inner = pull[1];
      const dashMatch = inner.match(/^(.+?)\s*[—–-]\s*(.+)$/);
      if (dashMatch) {
        out.push({ kind: 'pullquote', text: dashMatch[1].replace(/^["“](.+?)["”]$/, '$1'), attribution: dashMatch[2] });
      } else {
        out.push({ kind: 'pullquote', text: inner.replace(/^["“](.+?)["”]$/, '$1') });
      }
      continue;
    }

    // Blockquote
    if (line.startsWith('> ')) {
      flushAll();
      out.push({ kind: 'quote', html: inline(line.slice(2)) });
      continue;
    }

    // Ordered list
    const ol = line.match(/^(\d+)\.\s+(.*)$/);
    if (ol) {
      flushPara();
      if (listType !== 'ol') {
        flushList();
        listType = 'ol';
      }
      listItems.push(inline(ol[2]));
      continue;
    }

    // Unordered list
    const ul = line.match(/^[-*]\s+(.*)$/);
    if (ul) {
      flushPara();
      if (listType !== 'ul') {
        flushList();
        listType = 'ul';
      }
      listItems.push(inline(ul[1]));
      continue;
    }

    // Regular paragraph line
    flushList();
    buf.push(line);
  }
  flushAll();
  return out;
}

export function LessonBody({ markdown, className }: { markdown: string; className?: string }) {
  const nodes = parse(markdown);
  return (
    <div className={cn('text-[16px] leading-relaxed sm:text-[17px]', className)}>
      {nodes.map((n, i) => {
        switch (n.kind) {
          case 'p':
            return (
              <p
                key={i}
                className="my-4 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: n.html }}
              />
            );
          case 'ul':
            return (
              <ul key={i} className="my-3 list-disc space-y-1.5 pl-6">
                {n.items.map((it, j) => (
                  <li key={j} dangerouslySetInnerHTML={{ __html: it }} />
                ))}
              </ul>
            );
          case 'ol':
            return (
              <ol key={i} className="my-3 list-decimal space-y-1.5 pl-6">
                {n.items.map((it, j) => (
                  <li key={j} dangerouslySetInnerHTML={{ __html: it }} />
                ))}
              </ol>
            );
          case 'quote':
            return (
              <blockquote
                key={i}
                className="my-5 border-l-4 border-brand-400 bg-muted/40 px-4 py-2 italic text-muted-fg"
                dangerouslySetInnerHTML={{ __html: n.html }}
              />
            );
          case 'image':
            return <LessonImage key={i} src={n.src} caption={n.caption} />;
          case 'diagram':
            return <Diagram key={i} which={n.name} />;
          case 'pullquote':
            return (
              <aside key={i} className="my-8 rounded-2xl border border-brand-200 bg-gradient-to-br from-brand-50 to-amber-50 p-6 text-center dark:border-brand-800/60 dark:from-brand-950/40 dark:to-amber-950/30">
                <p className="font-display text-xl leading-snug sm:text-2xl">&ldquo;{n.text}&rdquo;</p>
                {n.attribution && (
                  <p className="mt-2 text-xs uppercase tracking-widest text-muted-fg">— {n.attribution}</p>
                )}
              </aside>
            );
        }
      })}
    </div>
  );
}
