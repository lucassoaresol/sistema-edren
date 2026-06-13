import { Label } from '@/components/ui/label';

export function Field({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <label className="space-y-2">
      <Label>{label}</Label>
      {children}
    </label>
  );
}

export function Select({ children, disabled, onChange, value }: {
  children: React.ReactNode;
  disabled?: boolean;
  onChange: (value: string) => void;
  value: string;
}) {
  return (
    <select
      className="h-11 w-full rounded-xl border border-edren-border bg-edren-surface px-3 text-sm text-edren-text outline-none transition-colors focus:border-edren-green focus:ring-2 focus:ring-edren-green/15 disabled:opacity-60"
      disabled={disabled}
      onChange={(event) => onChange(event.target.value)}
      value={value}
    >
      {children}
    </select>
  );
}

export function QueryState({ empty, loading }: { empty: boolean; loading: boolean }) {
  if (loading) {
    return <p className="rounded-xl bg-edren-muted px-3 py-2 text-sm text-edren-text-muted">Carregando catálogo...</p>;
  }

  if (empty) {
    return <p className="rounded-xl bg-edren-muted px-3 py-2 text-sm text-edren-text-muted">Nenhum registro encontrado.</p>;
  }

  return null;
}
