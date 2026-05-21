'use client';

import * as React from 'react';
import { toast } from 'sonner';
import {
  Search,
  Plus,
  Trash2,
  KeyRound,
  X,
  Check,
  Mail,
  Calendar,
  BookOpen,
  Camera,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Field } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';
import { formatRelative } from '@/lib/utils';

type Role = 'STUDENT' | 'INSTRUCTOR' | 'ADMIN' | 'SUPERADMIN';

type User = {
  id: string;
  email: string;
  name: string | null;
  role: Role;
  avatarUrl: string | null;
  country: string | null;
  locale: string;
  createdAt: string;
  _count?: { enrolments: number; submissions: number };
};

const ROLE_TONES: Record<Role, 'default' | 'brand' | 'accent' | 'success'> = {
  STUDENT: 'default',
  INSTRUCTOR: 'success',
  ADMIN: 'accent',
  SUPERADMIN: 'brand',
};

export function UsersManager({
  initial,
  currentUserId,
  currentUserRole,
}: {
  initial: User[];
  currentUserId: string;
  currentUserRole: Role;
}) {
  const [users, setUsers] = React.useState<User[]>(initial);
  const [query, setQuery] = React.useState('');
  const [showCreate, setShowCreate] = React.useState(false);
  const [resetTarget, setResetTarget] = React.useState<User | null>(null);

  const isSuper = currentUserRole === 'SUPERADMIN';

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) =>
        u.email.toLowerCase().includes(q) ||
        (u.name?.toLowerCase().includes(q) ?? false) ||
        u.role.toLowerCase().includes(q)
    );
  }, [users, query]);

  const counts = React.useMemo(() => {
    const c: Record<Role, number> = { STUDENT: 0, INSTRUCTOR: 0, ADMIN: 0, SUPERADMIN: 0 };
    users.forEach((u) => c[u.role]++);
    return c;
  }, [users]);

  const changeRole = async (id: string, newRole: Role) => {
    try {
      const r = await fetch(`/api/admin/users/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data?.error ?? 'Failed');
      setUsers((us) => us.map((u) => (u.id === id ? { ...u, role: newRole } : u)));
      toast.success(`Role updated to ${newRole}`);
    } catch (e: any) {
      toast.error(e?.message ?? 'Could not update role');
    }
  };

  const remove = async (u: User) => {
    if (!confirm(`Delete ${u.email}? This cannot be undone.`)) return;
    try {
      const r = await fetch(`/api/admin/users/${u.id}`, { method: 'DELETE' });
      const data = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(data?.error ?? 'Failed');
      setUsers((us) => us.filter((x) => x.id !== u.id));
      toast.success('User deleted');
    } catch (e: any) {
      toast.error(e?.message ?? 'Could not delete user');
    }
  };

  return (
    <div className="space-y-4">
      {/* Stats strip */}
      <div className="grid gap-3 sm:grid-cols-4">
        {(['STUDENT', 'INSTRUCTOR', 'ADMIN', 'SUPERADMIN'] as Role[]).map((r) => (
          <Card key={r}>
            <CardContent className="flex items-center justify-between py-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-fg">{r}</p>
                <p className="heading-display mt-1 text-2xl">{counts[r]}</p>
              </div>
              <Badge tone={ROLE_TONES[r]}>{r === 'SUPERADMIN' ? 'super' : r.slice(0, 1)}</Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-fg" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, email, or role…"
            className="pl-9"
          />
        </div>
        <Button onClick={() => setShowCreate(true)}>
          <Plus className="h-4 w-4" /> Create user
        </Button>
      </div>

      {/* Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="border-b border-border bg-muted/40 text-left">
              <tr className="text-[11px] uppercase tracking-wider text-muted-fg">
                <th className="px-4 py-3 font-semibold">User</th>
                <th className="px-4 py-3 font-semibold">Role</th>
                <th className="px-4 py-3 font-semibold">Activity</th>
                <th className="px-4 py-3 font-semibold">Joined</th>
                <th className="px-4 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-muted-fg">
                    No users match your search.
                  </td>
                </tr>
              )}
              {filtered.map((u) => {
                const isSelf = u.id === currentUserId;
                const canManageRole = isSuper || u.role === 'STUDENT' || u.role === 'INSTRUCTOR';
                return (
                  <tr key={u.id} className="hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-500/15 text-sm font-semibold text-brand-700 dark:text-brand-300">
                          {(u.name?.[0] || u.email[0]).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-medium">{u.name || '—'}</p>
                          <p className="truncate text-xs text-muted-fg">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {isSelf ? (
                        <Badge tone={ROLE_TONES[u.role]}>{u.role} (you)</Badge>
                      ) : canManageRole ? (
                        <select
                          value={u.role}
                          onChange={(e) => changeRole(u.id, e.target.value as Role)}
                          className="rounded-lg border border-border bg-background px-2 py-1 text-xs"
                        >
                          <option value="STUDENT">Student</option>
                          <option value="INSTRUCTOR">Instructor</option>
                          {isSuper && <option value="ADMIN">Admin</option>}
                          {isSuper && <option value="SUPERADMIN">Superadmin</option>}
                        </select>
                      ) : (
                        <Badge tone={ROLE_TONES[u.role]}>{u.role}</Badge>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-fg">
                      <div className="flex items-center gap-3">
                        <span className="inline-flex items-center gap-1"><BookOpen className="h-3 w-3" />{u._count?.enrolments ?? 0}</span>
                        <span className="inline-flex items-center gap-1"><Camera className="h-3 w-3" />{u._count?.submissions ?? 0}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-fg">
                      <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3" />{formatRelative(u.createdAt)}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex items-center gap-1">
                        <Button size="sm" variant="ghost" asChild title="Email">
                          <a href={`mailto:${u.email}`}><Mail className="h-3.5 w-3.5" /></a>
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setResetTarget(u)} title="Reset password">
                          <KeyRound className="h-3.5 w-3.5" />
                        </Button>
                        {!isSelf && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => remove(u)}
                            title="Delete"
                            className="text-rose-600 hover:bg-rose-50 hover:text-rose-700 dark:hover:bg-rose-950/40"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {showCreate && (
        <CreateUserDialog
          isSuper={isSuper}
          onClose={() => setShowCreate(false)}
          onCreated={(u) => {
            setUsers((us) => [u, ...us]);
            setShowCreate(false);
          }}
        />
      )}

      {resetTarget && (
        <ResetPasswordDialog
          user={resetTarget}
          onClose={() => setResetTarget(null)}
        />
      )}
    </div>
  );
}

function CreateUserDialog({
  isSuper,
  onClose,
  onCreated,
}: {
  isSuper: boolean;
  onClose: () => void;
  onCreated: (u: User) => void;
}) {
  const [form, setForm] = React.useState({ email: '', password: '', name: '', role: 'STUDENT' as Role });
  const [saving, setSaving] = React.useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const r = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data?.error ?? 'Failed');
      toast.success('User created');
      onCreated({
        ...data.user,
        avatarUrl: null,
        country: null,
        locale: 'en',
        _count: { enrolments: 0, submissions: 0 },
      });
    } catch (e: any) {
      toast.error(e?.message ?? 'Could not create user');
    } finally {
      setSaving(false);
    }
  };

  return (
    <DialogShell title="Create user" onClose={onClose}>
      <form onSubmit={submit} className="space-y-4">
        <Field label="Email">
          <Input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </Field>
        <Field label="Name (optional)">
          <Input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </Field>
        <Field label="Temporary password" hint="8+ characters. Tell the user — they can change it later.">
          <Input
            type="text"
            required
            minLength={8}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </Field>
        <Field label="Role">
          <select
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value as Role })}
            className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm"
          >
            <option value="STUDENT">Student</option>
            <option value="INSTRUCTOR">Instructor</option>
            <option value="ADMIN">Admin</option>
            {isSuper && <option value="SUPERADMIN">Superadmin</option>}
          </select>
        </Field>
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" disabled={saving}>
            {saving ? 'Creating…' : <><Check className="h-4 w-4" /> Create user</>}
          </Button>
        </div>
      </form>
    </DialogShell>
  );
}

function ResetPasswordDialog({ user, onClose }: { user: User; onClose: () => void }) {
  const [password, setPassword] = React.useState('');
  const [saving, setSaving] = React.useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    setSaving(true);
    try {
      const r = await fetch(`/api/admin/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data?.error ?? 'Failed');
      toast.success('Password reset — send it to the user');
      onClose();
    } catch (e: any) {
      toast.error(e?.message ?? 'Could not reset password');
    } finally {
      setSaving(false);
    }
  };

  return (
    <DialogShell title={`Reset password for ${user.email}`} onClose={onClose}>
      <form onSubmit={submit} className="space-y-4">
        <Field label="New password" hint="8+ characters. Copy and send to the user — we cannot recover it later.">
          <Input
            type="text"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Field>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" disabled={saving}>
            {saving ? 'Saving…' : 'Reset password'}
          </Button>
        </div>
      </form>
    </DialogShell>
  );
}

function DialogShell({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-border bg-background p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="heading-display text-xl">{title}</h2>
          <button onClick={onClose} className="rounded-full p-1 text-muted-fg hover:bg-muted">
            <X className="h-4 w-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
