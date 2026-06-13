import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { type Color, type ColorPayload, configQueryKeys, createColor, getColors, updateColor } from '@/lib/api';

export function ColorsCard() {
  const queryClient = useQueryClient();
  const recordsQuery = useQuery({ queryKey: configQueryKeys.colors(), queryFn: getColors });
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');

  const createMutation = useMutation({
    mutationFn: createColor,
    onError: () => toast.error('Não foi possível salvar a cor.'),
    onSuccess: async () => {
      setName('');
      setSlug('');
      await queryClient.invalidateQueries({ queryKey: configQueryKeys.colors() });
      toast.success('Cor salva.');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: ColorPayload }) => updateColor(id, input),
    onError: () => toast.error('Não foi possível atualizar a cor.'),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: configQueryKeys.colors() });
      toast.success('Cor atualizada.');
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cores</CardTitle>
        <CardDescription>Cores disponíveis para criar SKUs.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form
          className="grid gap-3 md:grid-cols-[1fr_1fr_auto]"
          onSubmit={(event) => {
            event.preventDefault();
            createMutation.mutate({ name, slug: slug || undefined });
          }}
        >
          <Input onChange={(event) => setName(event.target.value)} placeholder="Nome" required value={name} />
          <Input onChange={(event) => setSlug(event.target.value)} placeholder="Identificador opcional" value={slug} />
          <Button disabled={createMutation.isPending} type="submit">Adicionar</Button>
        </form>

        {recordsQuery.data ? (
          <ColorList
            records={recordsQuery.data}
            onSave={(record, input) => updateMutation.mutate({ id: record.id, input })}
            onToggle={(record) => updateMutation.mutate({ id: record.id, input: { isActive: !record.isActive } })}
          />
        ) : null}
      </CardContent>
    </Card>
  );
}

function ColorList({ onSave, onToggle, records }: {
  onSave: (record: Color, input: ColorPayload) => void;
  onToggle: (record: Color) => void;
  records: Color[];
}) {
  if (records.length === 0) {
    return <p className="rounded-xl bg-edren-muted px-3 py-2 text-sm text-edren-text-muted">Nenhuma cor cadastrada.</p>;
  }

  return (
    <div className="divide-y divide-edren-border overflow-hidden rounded-2xl border border-edren-border">
      {records.map((record) => (
        <EditableColorRow key={record.id} onSave={onSave} onToggle={onToggle} record={record} />
      ))}
    </div>
  );
}

function EditableColorRow({ onSave, onToggle, record }: {
  onSave: (record: Color, input: ColorPayload) => void;
  onToggle: (record: Color) => void;
  record: Color;
}) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(record.name);
  const [slug, setSlug] = useState(record.slug ?? '');

  if (editing) {
    return (
      <form
        className="grid gap-3 bg-edren-surface p-3 md:grid-cols-[1fr_1fr_auto_auto]"
        onSubmit={(event) => {
          event.preventDefault();
          onSave(record, { name, slug: slug || null });
          setEditing(false);
        }}
      >
        <Input onChange={(event) => setName(event.target.value)} required value={name} />
        <Input onChange={(event) => setSlug(event.target.value)} placeholder="Identificador" value={slug} />
        <Button type="submit">Salvar</Button>
        <Button onClick={() => setEditing(false)} type="button" variant="secondary">Cancelar</Button>
      </form>
    );
  }

  return (
    <div className="flex flex-col gap-3 bg-edren-surface p-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0 flex-1">
        <p className="break-words font-medium text-edren-green">{record.name}</p>
        {record.slug ? <p className="mt-1 break-words text-xs text-edren-text-muted">{record.slug}</p> : null}
      </div>
      <div className="flex shrink-0 flex-wrap items-center gap-2">
        <Badge className={record.isActive ? undefined : 'bg-red-50 text-red-800'}>{record.isActive ? 'Ativo' : 'Inativo'}</Badge>
        <Button onClick={() => setEditing(true)} size="sm" variant="ghost">Editar</Button>
        <Button onClick={() => onToggle(record)} size="sm" variant="secondary">
          {record.isActive ? 'Inativar' : 'Ativar'}
        </Button>
      </div>
    </div>
  );
}
