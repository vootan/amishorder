import { useState } from 'react';
import PricingHistory from './PricingHistory';
import { useInventory } from '../hooks/useInventory';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface AddPriceMutationVars {
  id: string;
  payload: {
    price: number;
    startDate: string;
  };
}

interface AddPriceFormProps {
  itemId: string;
  onClose: () => void;
  onAdded: () => void;
  mutation: {
    mutateAsync: (vars: AddPriceMutationVars) => Promise<unknown>;
    isPending: boolean;
  };
}

function getActivePrice(pricing: any[] = []) {
  const now = new Date();
  const candidates = pricing
    .map((r) => ({ ...r, startDate: new Date(r.startDate), endDate: r.endDate ? new Date(r.endDate) : null }))
    .filter((r) => r.startDate <= now && (!r.endDate || r.endDate >= now));
  if (candidates.length === 0) return null;
  candidates.sort((a, b) => b.startDate.getTime() - a.startDate.getTime());
  return candidates[0].price;
}

export default function InventoryTable() {
  const { list, addPricing, softDeleteItem, hardDeletePricing } = useInventory();
  const items = list.data ?? [];
  const [selected, setSelected] = useState<string | null>(null);
  const [historyItem, setHistoryItem] = useState<any | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  async function handleSoftDelete(itemId: string) {
    setActionError(null);
    const ok = window.confirm('Soft delete this inventory item? It will be hidden from the list.');
    if (!ok) return;

    try {
      await softDeleteItem.mutateAsync(itemId);
      if (historyItem && (historyItem._id ?? historyItem.id) === itemId) {
        setHistoryItem(null);
      }
    } catch {
      setActionError('Could not delete inventory item.');
    }
  }

  async function handleHardDeletePricing(itemId: string, pricingId: string) {
    setActionError(null);
    const ok = window.confirm('Hard delete this price update? This cannot be undone.');
    if (!ok) return;

    try {
      await hardDeletePricing.mutateAsync({ id: itemId, pricingId });
    } catch {
      setActionError('Could not delete pricing update.');
    }
  }

  if (list.isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    );
  }

  if (items.length === 0) {
    return <div className="text-center py-8 text-gray-500">No inventory items.</div>;
  }

  return (
    <div className="rounded-lg border bg-white overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Current Price</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((it: any) => (
            <TableRow key={it._id ?? it.id}>
              <TableCell className="font-medium">{it.name}</TableCell>
              <TableCell className="text-gray-600">{it.description}</TableCell>
              <TableCell>{getActivePrice(it.pricing) ?? '—'}</TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button size="sm" onClick={() => setSelected(it._id ?? it.id)}>
                    Add Price
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setHistoryItem(it)}>
                    View History
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    disabled={softDeleteItem.isPending}
                    onClick={() => void handleSoftDelete(it._id ?? it.id)}
                  >
                    Delete Item
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Simple drawer-like area for adding price */}
      {selected && (
        <div className="p-4 border-t bg-gray-50">
          <AddPriceForm
            itemId={selected}
            mutation={addPricing}
            onClose={() => setSelected(null)}
            onAdded={() => setSelected(null)}
          />
        </div>
      )}

      {historyItem && (
        <PricingHistory
          itemId={String(historyItem._id ?? historyItem.id)}
          pricing={historyItem.pricing}
          isDeleting={hardDeletePricing.isPending}
          onDeletePricing={(pricingId) =>
            handleHardDeletePricing(String(historyItem._id ?? historyItem.id), pricingId)
          }
          onClose={() => setHistoryItem(null)}
        />
      )}

      {actionError && <p className="text-sm text-red-600 p-4">{actionError}</p>}
    </div>
  );
}

function AddPriceForm({ itemId, onClose, onAdded, mutation }: AddPriceFormProps) {
  const [price, setPrice] = useState('');
  const [startDate, setStartDate] = useState('');
  const [error, setError] = useState<string | null>(null);

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().slice(0, 10);

  async function submit() {
    setError(null);
    if (!price || !startDate) return;

    const effectiveDate = new Date(startDate);
    if (Number.isNaN(effectiveDate.getTime())) {
      setError('Please select a valid effective date.');
      return;
    }

    if (effectiveDate.getTime() <= Date.now()) {
      setError('Effective date must be a future date.');
      return;
    }

    try {
      await mutation.mutateAsync({ id: itemId, payload: { price: Number(price), startDate } });
      onAdded();
    } catch {
      setError('Could not save pricing. Ensure the effective date is in the future.');
    }
  }

  return (
    <div>
      <div className="flex items-center gap-2">
        <input className="border rounded px-2 py-1" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} />
        <input
          type="date"
          className="border rounded px-2 py-1"
          value={startDate}
          min={minDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <Button size="sm" onClick={submit} disabled={mutation.isPending}>Save</Button>
        <Button size="sm" variant="ghost" onClick={onClose}>Cancel</Button>
      </div>
      {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
    </div>
  );
}
