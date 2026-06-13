import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  type Size,
  type SizeGrid,
  type SizePayload,
  configQueryKeys,
  createConfigRecord,
  createSize,
  getSizeGrids,
  updateConfigRecord,
  updateSize,
} from '@/lib/api';

export function SizeGridsCard() {
  const queryClient = useQueryClient();
  const gridsQuery = useQuery({ queryKey: configQueryKeys.sizeGrids(), queryFn: getSizeGrids });
  const grids = gridsQuery.data ?? [];
  const [gridName, setGridName] = useState('');
  const [selectedGridId, setSelectedGridId] = useState(grids[0]?.id ?? '');
  const [sizeName, setSizeName] = useState('');
  const [sortOrder, setSortOrder] = useState('0');
  const selectedGrid = grids.find((grid) => grid.id === selectedGridId) ?? grids[0];

  const createGridMutation = useMutation({
    mutationFn: (input: { name: string }) => createConfigRecord('/api/config/size-grids', input),
    onError: () => toast.error('Não foi possível salvar a grade.'),
    onSuccess: async (grid) => {
      setGridName('');
      setSelectedGridId(grid.id);
      await queryClient.invalidateQueries({ queryKey: configQueryKeys.sizeGrids() });
      toast.success('Grade salva.');
    },
  });

  const updateGridMutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: { isActive?: boolean; name?: string } }) => updateConfigRecord('/api/config/size-grids', id, input),
    onError: () => toast.error('Não foi possível atualizar a grade.'),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: configQueryKeys.sizeGrids() });
      toast.success('Grade atualizada.');
    },
  });

  const createSizeMutation = useMutation({
    mutationFn: ({ gridId, name, order }: { gridId: string; name: string; order: number }) => createSize(gridId, { name, sortOrder: order }),
    onError: () => toast.error('Não foi possível salvar o tamanho.'),
    onSuccess: async () => {
      setSizeName('');
      await queryClient.invalidateQueries({ queryKey: configQueryKeys.sizeGrids() });
      toast.success('Tamanho salvo.');
    },
  });

  const updateSizeMutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: SizePayload }) => updateSize(id, input),
    onError: () => toast.error('Não foi possível atualizar o tamanho.'),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: configQueryKeys.sizeGrids() });
      toast.success('Tamanho atualizado.');
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Grades e tamanhos</CardTitle>
        <CardDescription>Organize tamanhos dentro de cada grade usada nos produtos.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-4">
          <form
            className="flex gap-3"
            onSubmit={(event) => {
              event.preventDefault();
              createGridMutation.mutate({ name: gridName });
            }}
          >
            <Input onChange={(event) => setGridName(event.target.value)} placeholder="Nova grade" required value={gridName} />
            <Button disabled={createGridMutation.isPending} type="submit">Adicionar</Button>
          </form>
          <RecordList
            records={grids}
            selectedId={selectedGrid?.id}
            selectionLabel="Selecionar grade"
            onSave={(record, input) => updateGridMutation.mutate({ id: record.id, input })}
            onSelect={(record) => setSelectedGridId(record.id)}
            onToggle={(record) => updateGridMutation.mutate({ id: record.id, input: { isActive: !record.isActive } })}
          />
          <QueryState error={gridsQuery.isError} loading={gridsQuery.isLoading} />
        </div>

        <div className="rounded-2xl border border-edren-border bg-edren-background/60 p-4">
          {selectedGrid ? (
            <div className="space-y-4">
              <div>
                <Label>Tamanhos de {selectedGrid.name}</Label>
                <p className="mt-1 text-xs text-edren-text-muted">A ordem controla a exibição nos próximos cadastros.</p>
              </div>
              <form
                className="grid gap-3 sm:grid-cols-[1fr_120px_auto]"
                onSubmit={(event) => {
                  event.preventDefault();
                  createSizeMutation.mutate({ gridId: selectedGrid.id, name: sizeName, order: Number(sortOrder) });
                }}
              >
                <Input onChange={(event) => setSizeName(event.target.value)} placeholder="Tamanho" required value={sizeName} />
                <Input onChange={(event) => setSortOrder(event.target.value)} placeholder="Ordem" type="number" value={sortOrder} />
                <Button disabled={createSizeMutation.isPending} type="submit">Adicionar</Button>
              </form>
              <SizeList
                records={selectedGrid.sizes}
                onSave={(record, input) => updateSizeMutation.mutate({ id: record.id, input })}
                onToggle={(record) => updateSizeMutation.mutate({ id: record.id, input: { isActive: !record.isActive } })}
              />
            </div>
          ) : (
            <p className="text-sm text-edren-text-muted">Crie uma grade para cadastrar tamanhos.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function QueryState({ error, loading }: { error: boolean; loading: boolean }) {
  if (loading) {
    return <p className="rounded-xl bg-edren-muted px-3 py-2 text-sm text-edren-text-muted">Carregando cadastros...</p>;
  }

  if (error) {
    return <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-800">Não foi possível carregar os cadastros.</p>;
  }

  return null;
}

function RecordList({ onSave, onSelect, onToggle, records, selectedId, selectionLabel }: {
  onSave: (record: SizeGrid, input: { name?: string }) => void;
  onSelect?: (record: SizeGrid) => void;
  onToggle: (record: SizeGrid) => void;
  records: SizeGrid[];
  selectedId?: string;
  selectionLabel?: string;
}) {
  if (records.length === 0) {
    return <p className="rounded-xl bg-edren-muted px-3 py-2 text-sm text-edren-text-muted">Nenhum registro cadastrado.</p>;
  }

  return (
    <div className="divide-y divide-edren-border overflow-hidden rounded-2xl border border-edren-border">
      {records.map((record) => (
        <EditableRecordRow
          key={record.id}
          onSave={onSave}
          onSelect={onSelect}
          onToggle={onToggle}
          record={record}
          selected={selectedId === record.id}
          selectionLabel={selectionLabel}
        />
      ))}
    </div>
  );
}

function EditableRecordRow({ onSave, onSelect, onToggle, record, selected, selectionLabel }: {
  onSave: (record: SizeGrid, input: { name?: string }) => void;
  onSelect?: (record: SizeGrid) => void;
  onToggle: (record: SizeGrid) => void;
  record: SizeGrid;
  selected: boolean;
  selectionLabel?: string;
}) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(record.name);

  if (editing) {
    return (
      <form
        className="grid gap-3 bg-edren-surface p-3 md:grid-cols-[1fr_auto_auto]"
        onSubmit={(event) => {
          event.preventDefault();
          onSave(record, { name });
          setEditing(false);
        }}
      >
        <Input onChange={(event) => setName(event.target.value)} required value={name} />
        <Button type="submit">Salvar</Button>
        <Button onClick={() => setEditing(false)} type="button" variant="secondary">Cancelar</Button>
      </form>
    );
  }

  return (
    <div
      className={`flex flex-col gap-3 bg-edren-surface p-3 sm:flex-row sm:items-center sm:justify-between ${
        onSelect ? 'cursor-pointer transition-colors hover:bg-edren-muted/55' : ''
      }`}
      onClick={() => onSelect?.(record)}
      role={onSelect ? 'button' : undefined}
      tabIndex={onSelect ? 0 : undefined}
    >
      <div className="min-w-0 flex-1 text-left">
        <p className="flex min-w-0 flex-wrap items-center gap-2 font-medium text-edren-green">
          <span className="min-w-0 break-words">{record.name}</span>
          {selected ? <Badge>Selecionado</Badge> : null}
        </p>
      </div>
      <div className="flex shrink-0 flex-wrap items-center gap-2" onClick={(event) => event.stopPropagation()}>
        <Badge className={record.isActive ? undefined : 'bg-red-50 text-red-800'}>{record.isActive ? 'Ativo' : 'Inativo'}</Badge>
        {onSelect ? (
          <Button onClick={() => onSelect(record)} size="sm" variant={selected ? 'default' : 'secondary'}>
            {selected ? 'Selecionada' : selectionLabel ?? 'Selecionar'}
          </Button>
        ) : null}
        <Button onClick={() => setEditing(true)} size="sm" variant="ghost">Editar</Button>
        <Button onClick={() => onToggle(record)} size="sm" variant="secondary">
          {record.isActive ? 'Inativar' : 'Ativar'}
        </Button>
      </div>
    </div>
  );
}

function SizeList({ onSave, onToggle, records }: {
  onSave: (record: Size, input: SizePayload) => void;
  onToggle: (record: Size) => void;
  records: Size[];
}) {
  if (records.length === 0) {
    return <p className="rounded-xl bg-edren-muted px-3 py-2 text-sm text-edren-text-muted">Nenhum tamanho nesta grade.</p>;
  }

  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {records.map((record) => (
        <EditableSizeRow key={record.id} onSave={onSave} onToggle={onToggle} record={record} />
      ))}
    </div>
  );
}

function EditableSizeRow({ onSave, onToggle, record }: {
  onSave: (record: Size, input: SizePayload) => void;
  onToggle: (record: Size) => void;
  record: Size;
}) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(record.name);
  const [sortOrder, setSortOrder] = useState(String(record.sortOrder));

  if (editing) {
    return (
      <form
        className="space-y-2 rounded-xl border border-edren-border bg-edren-surface p-3"
        onSubmit={(event) => {
          event.preventDefault();
          onSave(record, { name, sortOrder: Number(sortOrder) });
          setEditing(false);
        }}
      >
        <Input onChange={(event) => setName(event.target.value)} required value={name} />
        <Input onChange={(event) => setSortOrder(event.target.value)} type="number" value={sortOrder} />
        <div className="flex gap-2">
          <Button size="sm" type="submit">Salvar</Button>
          <Button onClick={() => setEditing(false)} size="sm" type="button" variant="secondary">Cancelar</Button>
        </div>
      </form>
    );
  }

  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-edren-border bg-edren-surface px-3 py-2">
      <div className="min-w-0">
        <p className="break-words font-medium text-edren-green">{record.name}</p>
        <p className="text-xs text-edren-text-muted">Ordem {record.sortOrder}</p>
      </div>
      <div className="flex shrink-0 gap-2">
        <Button onClick={() => setEditing(true)} size="sm" variant="ghost">Editar</Button>
        <Button onClick={() => onToggle(record)} size="sm" variant={record.isActive ? 'secondary' : 'default'}>
          {record.isActive ? 'Inativar' : 'Ativar'}
        </Button>
      </div>
    </div>
  );
}
