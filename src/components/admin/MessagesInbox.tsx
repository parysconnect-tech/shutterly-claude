'use client';

import * as React from 'react';
import { toast } from 'sonner';
import { Mail, MailOpen, Archive, ArchiveRestore, Trash2, Reply, Inbox } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { formatRelative } from '@/lib/utils';

type Message = {
  id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  archived: boolean;
  referer?: string | null;
  userAgent?: string | null;
  createdAt: string;
};

type Filter = 'all' | 'unread' | 'archived';

export function MessagesInbox({
  initial,
  unreadCount: initialUnread,
  archivedCount: initialArchived,
}: {
  initial: Message[];
  unreadCount: number;
  archivedCount: number;
}) {
  const [messages, setMessages] = React.useState<Message[]>(initial);
  const [unreadCount, setUnreadCount] = React.useState(initialUnread);
  const [archivedCount, setArchivedCount] = React.useState(initialArchived);
  const [filter, setFilter] = React.useState<Filter>('all');
  const [selectedId, setSelectedId] = React.useState<string | null>(initial[0]?.id ?? null);

  const refresh = React.useCallback(async (f: Filter) => {
    try {
      const r = await fetch(`/api/contact?filter=${f}`, { cache: 'no-store' });
      if (!r.ok) throw new Error();
      const data = await r.json();
      setMessages(data.messages);
      setUnreadCount(data.unreadCount ?? 0);
      if (f === 'archived') setArchivedCount(data.messages.length);
    } catch {
      toast.error('Could not load messages');
    }
  }, []);

  const changeFilter = (f: Filter) => {
    setFilter(f);
    refresh(f);
  };

  const patch = async (id: string, body: Partial<Pick<Message, 'read' | 'archived'>>) => {
    try {
      const r = await fetch(`/api/admin/messages/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!r.ok) throw new Error();
      // Optimistic local update
      setMessages((ms) => ms.map((m) => (m.id === id ? { ...m, ...body } : m)));
      if (body.read !== undefined) {
        setUnreadCount((c) => (body.read ? Math.max(0, c - 1) : c + 1));
      }
      if (body.archived !== undefined) {
        setArchivedCount((c) => (body.archived ? c + 1 : Math.max(0, c - 1)));
        if (filter !== 'archived' && body.archived) {
          setMessages((ms) => ms.filter((m) => m.id !== id));
        }
        if (filter === 'archived' && !body.archived) {
          setMessages((ms) => ms.filter((m) => m.id !== id));
        }
      }
    } catch {
      toast.error('Could not update message');
    }
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this message permanently?')) return;
    try {
      const r = await fetch(`/api/admin/messages/${id}`, { method: 'DELETE' });
      if (!r.ok) throw new Error();
      setMessages((ms) => ms.filter((m) => m.id !== id));
      if (selectedId === id) setSelectedId(null);
      toast.success('Message deleted');
    } catch {
      toast.error('Could not delete message');
    }
  };

  const selected = messages.find((m) => m.id === selectedId);

  // Auto-mark-read when a message is opened
  React.useEffect(() => {
    if (selected && !selected.read) {
      patch(selected.id, { read: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <FilterTab label="All" count={messages.length} active={filter === 'all'} onClick={() => changeFilter('all')} />
        <FilterTab label="Unread" count={unreadCount} active={filter === 'unread'} onClick={() => changeFilter('unread')} />
        <FilterTab label="Archived" count={archivedCount} active={filter === 'archived'} onClick={() => changeFilter('archived')} />
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(260px,360px)_1fr]">
        <Card className="overflow-hidden">
          <div className="max-h-[70vh] overflow-y-auto">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center gap-2 p-10 text-center text-muted-fg">
                <Inbox className="h-8 w-8" />
                <p className="text-sm">Nothing here yet.</p>
              </div>
            ) : (
              <ul className="divide-y divide-border">
                {messages.map((m) => {
                  const active = m.id === selectedId;
                  return (
                    <li key={m.id}>
                      <button
                        onClick={() => setSelectedId(m.id)}
                        className={cn(
                          'w-full px-4 py-3 text-left transition-colors',
                          active ? 'bg-brand-500/10' : 'hover:bg-muted',
                          !m.read && !active && 'bg-brand-500/5'
                        )}
                      >
                        <div className="flex items-center gap-2">
                          {!m.read ? <Mail className="h-3.5 w-3.5 text-brand-600" /> : <MailOpen className="h-3.5 w-3.5 text-muted-fg" />}
                          <span className={cn('truncate text-sm', !m.read && 'font-semibold')}>{m.name}</span>
                          <span className="ml-auto shrink-0 text-[10px] text-muted-fg">{formatRelative(m.createdAt)}</span>
                        </div>
                        <p className="ml-5 mt-0.5 truncate text-xs text-muted-fg">{m.email}</p>
                        <p className="ml-5 mt-1 line-clamp-2 text-xs text-muted-fg">{m.message}</p>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </Card>

        <Card>
          {selected ? (
            <CardContent className="pt-6">
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border pb-4">
                <div className="min-w-0">
                  <h2 className="heading-display text-2xl">{selected.name}</h2>
                  <a
                    href={`mailto:${selected.email}?subject=Re: your message on Shutterly`}
                    className="mt-1 inline-flex items-center gap-1.5 text-sm text-brand-600 hover:underline"
                  >
                    <Reply className="h-3.5 w-3.5" /> {selected.email}
                  </a>
                  <p className="mt-2 text-xs text-muted-fg">
                    {new Date(selected.createdAt).toLocaleString('en-ZA', {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}
                  </p>
                </div>
                <div className="flex gap-1.5">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => patch(selected.id, { read: !selected.read })}
                    title={selected.read ? 'Mark unread' : 'Mark read'}
                  >
                    {selected.read ? <Mail className="h-3.5 w-3.5" /> : <MailOpen className="h-3.5 w-3.5" />}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => patch(selected.id, { archived: !selected.archived })}
                    title={selected.archived ? 'Unarchive' : 'Archive'}
                  >
                    {selected.archived ? <ArchiveRestore className="h-3.5 w-3.5" /> : <Archive className="h-3.5 w-3.5" />}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => remove(selected.id)}
                    title="Delete"
                    className="text-rose-600 hover:bg-rose-50 hover:text-rose-700 dark:hover:bg-rose-950/40"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>

              <div className="whitespace-pre-wrap pt-4 text-sm leading-relaxed">
                {selected.message}
              </div>

              {(selected.referer || selected.userAgent) && (
                <div className="mt-6 rounded-lg bg-muted/40 p-3 text-[11px] text-muted-fg">
                  {selected.referer && <p><span className="font-medium">From:</span> {selected.referer}</p>}
                  {selected.userAgent && <p className="mt-0.5 truncate"><span className="font-medium">UA:</span> {selected.userAgent}</p>}
                </div>
              )}

              <div className="mt-4">
                <Button asChild size="sm">
                  <a href={`mailto:${selected.email}?subject=Re: your message on Shutterly&body=Hi ${selected.name},%0D%0A%0D%0A`}>
                    <Reply className="h-3.5 w-3.5" /> Reply by email
                  </a>
                </Button>
              </div>
            </CardContent>
          ) : (
            <div className="flex flex-col items-center gap-2 p-10 text-center text-muted-fg">
              <Inbox className="h-8 w-8" />
              <p className="text-sm">Pick a message to read it.</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

function FilterTab({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors',
        active ? 'bg-foreground text-background' : 'bg-muted text-muted-fg hover:bg-muted/80'
      )}
    >
      {label}
      {count > 0 && (
        <span className={cn('rounded-full px-1.5 text-[10px]', active ? 'bg-background/20' : 'bg-foreground/10')}>
          {count}
        </span>
      )}
    </button>
  );
}
