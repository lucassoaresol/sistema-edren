import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { type Collection, type CollectionPayload, createCollection, updateCollection } from '@/lib/api';
import { formatDate, toDateInputValue } from './collection-dates';
import { Field, QueryState } from './product-ui';

type CollectionFormState = {
  description: string;
  endDate: string;
  name: string;
  startDate: string;
};

export function CollectionsPanel({ collections, isAdmin, loading, onChanged }: {
  collections: Collection[];
  isAdmin: boolean;
  loading: boolean;
  onChanged: () => Promise<void>;
}) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState(() => toDateInputValue(new Date()));
  const [endDate, setEndDate] = useState('');
  const [editingCollectionId, setEditingCollectionId] = useState<string | null>(null);
  const [editingCollectionForm, setEditingCollectionForm] = useState<CollectionFormState>({
    description: '',
    endDate: '',
    name: '',
    startDate: '',
  });

  const createMutation = useMutation({
    mutationFn: (input: Required<Pick<CollectionPayload, 'name' | 'startDate'>> & CollectionPayload) => createCollection(input),
    onError: () => toast.error('Não foi possível salvar a coleção.'),
    onSuccess: async () => {
      setName('');
      setDescription('');
      setStartDate(toDateInputValue(new Date()));
      setEndDate('');
      await onChanged();
      toast.success('Coleção salva.');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: CollectionPayload }) => updateCollection(id, input),
    onError: () => toast.error('Não foi possível atualizar a coleção.'),
    onSuccess: async () => {
      setEditingCollectionId(null);
      await onChanged();
      toast.success('Coleção atualizada.');
    },
  });

  const startEditingCollection = (collection: Collection) => {
    setEditingCollectionId(collection.id);
    setEditingCollectionForm({
      description: collection.description ?? '',
      endDate: collection.endDate ? toDateInputValue(new Date(collection.endDate)) : '',
      name: collection.name,
      startDate: toDateInputValue(new Date(collection.startDate)),
    });
  };

  const saveEditingCollection = (collection: Collection) => {
    updateMutation.mutate({
      id: collection.id,
      input: {
        description: editingCollectionForm.description || null,
        endDate: editingCollectionForm.endDate || null,
        name: editingCollectionForm.name,
        startDate: editingCollectionForm.startDate,
      },
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Coleções</CardTitle>
        <CardDescription>Organize referências por coleção. O MVP usa apenas ativa ou arquivada.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isAdmin ? (
          <form
            className="grid gap-3 md:grid-cols-[1fr_1fr_160px_160px_auto]"
            onSubmit={(event) => {
              event.preventDefault();
              createMutation.mutate({ description: description || null, endDate: endDate || null, name, startDate });
            }}
          >
            <Input onChange={(event) => setName(event.target.value)} placeholder="Nome da coleção" required value={name} />
            <Input onChange={(event) => setDescription(event.target.value)} placeholder="Descrição opcional" value={description} />
            <Input onChange={(event) => setStartDate(event.target.value)} required type="date" value={startDate} />
            <Input onChange={(event) => setEndDate(event.target.value)} type="date" value={endDate} />
            <Button disabled={createMutation.isPending} type="submit">Adicionar</Button>
          </form>
        ) : null}
        <QueryState empty={collections.length === 0} loading={loading} />
        <div className="grid gap-3 md:grid-cols-2">
          {collections.map((collection) => {
            const isEditing = editingCollectionId === collection.id;

            return (
              <div className="rounded-2xl border border-edren-border bg-edren-background/60 p-4" key={collection.id}>
                {isEditing ? (
                  <form
                    className="space-y-3"
                    onSubmit={(event) => {
                      event.preventDefault();
                      saveEditingCollection(collection);
                    }}
                  >
                    <div className="grid gap-3 sm:grid-cols-2">
                      <Field label="Nome da coleção">
                        <Input onChange={(event) => setEditingCollectionForm({ ...editingCollectionForm, name: event.target.value })} required value={editingCollectionForm.name} />
                      </Field>
                      <Field label="Descrição">
                        <Input onChange={(event) => setEditingCollectionForm({ ...editingCollectionForm, description: event.target.value })} value={editingCollectionForm.description} />
                      </Field>
                      <Field label="Data de início">
                        <Input onChange={(event) => setEditingCollectionForm({ ...editingCollectionForm, startDate: event.target.value })} required type="date" value={editingCollectionForm.startDate} />
                      </Field>
                      <Field label="Data de fim">
                        <Input onChange={(event) => setEditingCollectionForm({ ...editingCollectionForm, endDate: event.target.value })} type="date" value={editingCollectionForm.endDate} />
                      </Field>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button disabled={updateMutation.isPending} size="sm" type="submit">Salvar</Button>
                      <Button onClick={() => setEditingCollectionId(null)} size="sm" type="button" variant="secondary">Cancelar</Button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium text-edren-green">{collection.name}</p>
                        {collection.description ? <p className="mt-1 text-sm text-edren-text-muted">{collection.description}</p> : null}
                        <p className="mt-1 text-xs text-edren-text-muted">
                          {formatDate(collection.startDate)} a {collection.endDate ? formatDate(collection.endDate) : 'sem data de fim'}
                        </p>
                      </div>
                      <Badge className={collection.status === 'ARCHIVED' ? 'bg-red-50 text-red-800' : undefined}>
                        {collection.status === 'ACTIVE' ? 'Ativa' : 'Arquivada'}
                      </Badge>
                    </div>
                    {isAdmin ? (
                      <div className="mt-4 flex flex-wrap gap-2">
                        <Button onClick={() => startEditingCollection(collection)} size="sm" variant="ghost">Editar</Button>
                        <Button
                          onClick={() => updateMutation.mutate({
                            id: collection.id,
                            input: { status: collection.status === 'ACTIVE' ? 'ARCHIVED' : 'ACTIVE' },
                          })}
                          size="sm"
                          variant="secondary"
                        >
                          {collection.status === 'ACTIVE' ? 'Arquivar' : 'Reativar'}
                        </Button>
                      </div>
                    ) : null}
                  </>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
