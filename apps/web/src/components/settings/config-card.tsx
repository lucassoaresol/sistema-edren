import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  type ConfigPayload,
  configQueryKeys,
  createConfigRecord,
  getConfigRecords,
  updateConfigRecord,
} from '@/lib/api';

export function ConfigCard({ description, path, queryKey, title }: {
  description: string;
  path: string;
  queryKey: string;
  title: string;
}) {
  const queryClient = useQueryClient();
  const recordsQuery = useQuery({
    queryKey: configQueryKeys.list(queryKey),
    queryFn: () => getConfigRecords(path),
  });
  const [name, setName] = useState('');
  const [descriptionValue, setDescriptionValue] = useState('');

  const createMutation = useMutation({
    mutationFn: (input: ConfigPayload) => createConfigRecord(path, input),
    onError: () => toast.error('Não foi possível salvar o cadastro.'),
    onSuccess: async () => {
      setName('');
      setDescriptionValue('');
      await queryClient.invalidateQueries({ queryKey: configQueryKeys.list(queryKey) });
      toast.success('Cadastro salvo.');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: ConfigPayload }) => updateConfigRecord(path, id, input),
    onError: () => toast.error('Não foi possível atualizar o cadastro.'),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: configQueryKeys.list(queryKey) });
      toast.success('Cadastro atualizado.');
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form
          className="grid gap-3 md:grid-cols-[1fr_1fr_auto]"
          onSubmit={(event) => {
            event.preventDefault();
            createMutation.mutate({ name, description: descriptionValue || null });
          }}
        >
          <Input onChange={(event) => setName(event.target.value)} placeholder="Nome" required value={name} />
          <Input
            onChange={(event) => setDescriptionValue(event.target.value)}
            placeholder="Descrição opcional"
            value={descriptionValue}
          />
          <Button disabled={createMutation.isPending} type="submit">Adicionar</Button>
        </form>

        <QueryState error={recordsQuery.isError} loading={recordsQuery.isLoading} />
        {recordsQuery.data ? (
          <RecordList
            records={recordsQuery.data}
            onSave={(record, input) => updateMutation.mutate({ id: record.id, input })}
            onToggle={(record) => updateMutation.mutate({ id: record.id, input: { isActive: !record.isActive } })}
          />
        ) : null}
      </CardContent>
    </Card>
  );
}

type ConfigRecord = Awaited<ReturnType<typeof getConfigRecords>>[number];

function QueryState({ error, loading }: { error: boolean; loading: boolean }) {
  if (loading) {
    return <p className="rounded-xl bg-edren-muted px-3 py-2 text-sm text-edren-text-muted">Carregando cadastros...</p>;
  }

  if (error) {
    return <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-800">Não foi possível carregar os cadastros.</p>;
  }

  return null;
}

function RecordList({ onSave, onToggle, records }: {
  onSave: (record: ConfigRecord, input: ConfigPayload) => void;
  onToggle: (record: ConfigRecord) => void;
  records: ConfigRecord[];
}) {
  if (records.length === 0) {
    return <p className="rounded-xl bg-edren-muted px-3 py-2 text-sm text-edren-text-muted">Nenhum registro cadastrado.</p>;
  }

  return (
    <div className="divide-y divide-edren-border overflow-hidden rounded-2xl border border-edren-border">
      {records.map((record) => (
        <EditableRecordRow key={record.id} onSave={onSave} onToggle={onToggle} record={record} />
      ))}
    </div>
  );
}

function EditableRecordRow({ onSave, onToggle, record }: {
  onSave: (record: ConfigRecord, input: ConfigPayload) => void;
  onToggle: (record: ConfigRecord) => void;
  record: ConfigRecord;
}) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(record.name);
  const [description, setDescription] = useState(record.description ?? '');

  if (editing) {
    return (
      <form
        className="grid gap-3 bg-edren-surface p-3 md:grid-cols-[1fr_1fr_auto_auto]"
        onSubmit={(event) => {
          event.preventDefault();
          onSave(record, { name, description: description || null });
          setEditing(false);
        }}
      >
        <Input onChange={(event) => setName(event.target.value)} required value={name} />
        <Input onChange={(event) => setDescription(event.target.value)} placeholder="Descrição opcional" value={description} />
        <Button type="submit">Salvar</Button>
        <Button onClick={() => setEditing(false)} type="button" variant="secondary">Cancelar</Button>
      </form>
    );
  }

  return (
    <div className="flex flex-col gap-3 bg-edren-surface p-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0 flex-1 text-left">
        <p className="break-words font-medium text-edren-green">{record.name}</p>
        {record.description ? <p className="mt-1 break-words text-xs text-edren-text-muted">{record.description}</p> : null}
      </div>
      <div className="flex shrink-0 flex-wrap items-center gap-2">
        <Button onClick={() => setEditing(true)} size="sm" variant="ghost">Editar</Button>
        <Button onClick={() => onToggle(record)} size="sm" variant="secondary">
          {record.isActive ? 'Inativar' : 'Ativar'}
        </Button>
      </div>
    </div>
  );
}
