import { useState } from 'react';
import { useInventory } from '../hooks/useInventory';
import { Button } from '@/components/ui/button';

// Simple validation and field states

export default function InventoryForm() {
  const { create } = useInventory();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [startDate, setStartDate] = useState('');
  const [errors, setErrors] = useState<string | null>(null);

  async function submit() {
    setErrors(null);
    if (!name) {
      setErrors('Name is required');
      return;
    }
    if (price && isNaN(Number(price))) {
      setErrors('Price must be a number');
      return;
    }
    const payload: any = { name, description };
    if (price && startDate) {
      payload.pricing = [{ price: Number(price), startDate }];
    }
    await create.mutateAsync(payload);
    setName('');
    setDescription('');
    setPrice('');
    setStartDate('');
  }

  return (
    <div className="rounded-lg border bg-white p-4">
      <div className="grid grid-cols-3 gap-2">
        <input className="border rounded px-2 py-1 col-span-1" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input className="border rounded px-2 py-1 col-span-1" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        <input className="border rounded px-2 py-1" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} />
        <input type="date" className="border rounded px-2 py-1" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        <div />
      </div>
      {errors && <div className="text-red-600 text-sm mt-2">{errors}</div>}
      <div className="mt-3 flex gap-2">
        <Button onClick={submit} disabled={create.isPending}>Create Item</Button>
      </div>
    </div>
  );
}
