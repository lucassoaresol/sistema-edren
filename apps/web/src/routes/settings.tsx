import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  type Color,
  type ColorPayload,
  type ConfigPayload,
  type ConfigRecord,
  type Size,
  type SizeGrid,
  createColor,
  createConfigRecord,
  createSize,
  getColors,
  getConfigRecords,
  getSizeGrids,
  updateColor,
  updateConfigRecord,
  updateSize,
} from '@/lib/api';

const configQueryKey = ['config'] as const;
type ConfigTab = 'size-grids' | 'categories' | 'colors' | 'stock-locations' | 'sales-channels' | 'payment-methods';

const sections = [
  {
    tab: 'categories',
    title: 'Categorias',
    description: 'Tipos de produto usados no catálogo.',
    path: '/api/config/categories',
  },
  {
    tab: 'stock-locations',
    title: 'Locais de estoque',
    description: 'Locais reais onde a EDREN controla saldo.',
    path: '/api/config/stock-locations',
  },
  {
    tab: 'sales-channels',
    title: 'Canais de venda',
    description: 'Origem comercial obrigatória das vendas.',
    path: '/api/config/sales-channels',
  },
  {
    tab: 'payment-methods',
    title: 'Formas de pagamento',
    description: 'Meios usados no registro de pagamentos.',
    path: '/api/config/payment-methods',
  },
] as const;

const tabs = [
  { id: 'size-grids', label: 'Grades e tamanhos' },
  { id: 'categories', label: 'Categorias' },
  { id: 'colors', label: 'Cores' },
  { id: 'stock-locations', label: 'Locais de estoque' },
  { id: 'sales-channels', label: 'Canais de venda' },
  { id: 'payment-methods', label: 'Formas de pagamento' },
] satisfies Array<{ id: ConfigTab; label: string }>;

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState<ConfigTab>('size-grids');
  const activeSection = sections.find((section) => section.tab === activeTab);

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-edren-text-muted">Operação</p>
          <h1 className="mt-2 text-3xl font-semibold text-edren-green">Configurações</h1>
          <p className="mt-2 max-w-2xl text-sm text-edren-text-muted">
            Cadastros editáveis que alimentam produtos, estoque, vendas e pagamentos.
          </p>
        </div>
        <Badge>Somente administradores alteram</Badge>
      </div>

      <div className="flex gap-2 overflow-x-auto rounded-2xl border border-edren-border bg-edren-surface p-2">
        {tabs.map((tab) => (
          <Button
            className="shrink-0"
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            variant={activeTab === tab.id ? 'default' : 'ghost'}
          >
            {tab.label}
          </Button>
        ))}
      </div>

      {activeTab === 'size-grids' ? <SizeGridsCard /> : null}
      {activeTab === 'colors' ? <ColorsCard /> : null}
      {activeSection ? (
        <ConfigCard
          description={activeSection.description}
          path={activeSection.path}
          queryKey={activeSection.tab}
          title={activeSection.title}
        />
      ) : null}
    </div>
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

function ConfigCard({ description, path, queryKey, title }: {
  description: string;
  path: string;
  queryKey: ConfigTab;
  title: string;
}) {
  const queryClient = useQueryClient();
  const recordsQuery = useQuery({
    queryKey: [...configQueryKey, queryKey],
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
      await queryClient.invalidateQueries({ queryKey: [...configQueryKey, queryKey] });
      toast.success('Cadastro salvo.');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: ConfigPayload }) => updateConfigRecord(path, id, input),
    onError: () => toast.error('Não foi possível atualizar o cadastro.'),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [...configQueryKey, queryKey] });
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

function ColorsCard() {
  const queryClient = useQueryClient();
  const recordsQuery = useQuery({ queryKey: [...configQueryKey, 'colors'], queryFn: getColors });
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');

  const createMutation = useMutation({
    mutationFn: createColor,
    onError: () => toast.error('Não foi possível salvar a cor.'),
    onSuccess: async () => {
      setName('');
      setSlug('');
      await queryClient.invalidateQueries({ queryKey: [...configQueryKey, 'colors'] });
      toast.success('Cor salva.');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: ColorPayload }) => updateColor(id, input),
    onError: () => toast.error('Não foi possível atualizar a cor.'),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [...configQueryKey, 'colors'] });
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

        <QueryState error={recordsQuery.isError} loading={recordsQuery.isLoading} />
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

function SizeGridsCard() {
  const queryClient = useQueryClient();
  const gridsQuery = useQuery({ queryKey: [...configQueryKey, 'size-grids'], queryFn: getSizeGrids });
  const grids = gridsQuery.data ?? [];
  const [gridName, setGridName] = useState('');
  const [selectedGridId, setSelectedGridId] = useState(grids[0]?.id ?? '');
  const [sizeName, setSizeName] = useState('');
  const [sortOrder, setSortOrder] = useState('0');
  const selectedGrid = grids.find((grid) => grid.id === selectedGridId) ?? grids[0];

  const createGridMutation = useMutation({
    mutationFn: (input: ConfigPayload) => createConfigRecord('/api/config/size-grids', input),
    onError: () => toast.error('Não foi possível salvar a grade.'),
    onSuccess: async (grid) => {
      setGridName('');
      setSelectedGridId(grid.id);
      await queryClient.invalidateQueries({ queryKey: [...configQueryKey, 'size-grids'] });
      toast.success('Grade salva.');
    },
  });

  const updateGridMutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: ConfigPayload }) => updateConfigRecord('/api/config/size-grids', id, input),
    onError: () => toast.error('Não foi possível atualizar a grade.'),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [...configQueryKey, 'size-grids'] });
      toast.success('Grade atualizada.');
    },
  });

  const createSizeMutation = useMutation({
    mutationFn: ({ gridId, name, order }: { gridId: string; name: string; order: number }) => createSize(gridId, { name, sortOrder: order }),
    onError: () => toast.error('Não foi possível salvar o tamanho.'),
    onSuccess: async () => {
      setSizeName('');
      await queryClient.invalidateQueries({ queryKey: [...configQueryKey, 'size-grids'] });
      toast.success('Tamanho salvo.');
    },
  });

  const updateSizeMutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: { isActive?: boolean; name?: string; sortOrder?: number } }) => updateSize(id, input),
    onError: () => toast.error('Não foi possível atualizar o tamanho.'),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [...configQueryKey, 'size-grids'] });
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

function RecordList({ onSave, onSelect, onToggle, records, selectedId, selectionLabel }: {
  onSave: (record: ConfigRecord, input: ConfigPayload) => void;
  onSelect?: (record: ConfigRecord) => void;
  onToggle: (record: ConfigRecord) => void;
  records: ConfigRecord[];
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
  onSave: (record: ConfigRecord, input: ConfigPayload) => void;
  onSelect?: (record: ConfigRecord) => void;
  onToggle: (record: ConfigRecord) => void;
  record: ConfigRecord;
  selected: boolean;
  selectionLabel?: string;
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
        {record.description ? <p className="mt-1 break-words text-xs text-edren-text-muted">{record.description}</p> : null}
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

function SizeList({ onSave, onToggle, records }: {
  onSave: (record: Size, input: { isActive?: boolean; name?: string; sortOrder?: number }) => void;
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
  onSave: (record: Size, input: { isActive?: boolean; name?: string; sortOrder?: number }) => void;
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
