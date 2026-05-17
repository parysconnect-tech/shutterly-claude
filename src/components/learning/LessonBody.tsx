import { cn } from '@/lib/utils';

// Light-weight markdown-to-html: supports **bold**, paragraphs, ordered and unordered lists.
function render(md: string) {
  const lines = md.split(/\r?\n/);
  const out: string[] = [];
  let listType: 'ul' | 'ol' | null = null;

  function closeList() {
    if (listType) {
      out.push(`</${listType}>`);
      listType = null;
    }
  }

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) { closeList(); continue; }
    const ol = line.match(/^(\d+)\.\s+(.*)$/);
    const ul = line.match(/^[-*]\s+(.*)$/);
    if (ol) {
      if (listType !== 'ol') { closeList(); out.push('<ol class="list-decimal pl-6 space-y-1.5 my-3">'); listType = 'ol'; }
      out.push(`<li>${inline(ol[2])}</li>`);
    } else if (ul) {
      if (listType !== 'ul') { closeList(); out.push('<ul class="list-disc pl-6 space-y-1.5 my-3">'); listType = 'ul'; }
      out.push(`<li>${inline(ul[1])}</li>`);
    } else {
      closeList();
      out.push(`<p class="my-4 leading-relaxed">${inline(line)}</p>`);
    }
  }
  closeList();
  return out.join('\n');
}

function inline(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code class="rounded bg-muted px-1 py-0.5 text-[0.9em]">$1</code>');
}

export function LessonBody({ markdown, className }: { markdown: string; className?: string }) {
  return (
    <div
      className={cn('text-[15px] sm:text-base', className)}
      dangerouslySetInnerHTML={{ __html: render(markdown) }}
    />
  );
}
