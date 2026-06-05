import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchInventory,
  createInventory,
  addInventoryPricing,
  softDeleteInventory,
  hardDeleteInventoryPricing,
} from '../api/adminApi';

export function useInventory() {
  const qc = useQueryClient();

  const list = useQuery({
    queryKey: ['admin', 'inventory'],
    queryFn: fetchInventory,
    staleTime: 1000 * 60,
  });

  const create = useMutation({
    mutationFn: createInventory,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'inventory'] }),
  });

  const addPricing = useMutation({
    mutationFn: ({ id, payload }: any) => addInventoryPricing(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'inventory'] }),
  });

  const softDeleteItem = useMutation({
    mutationFn: (id: string) => softDeleteInventory(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'inventory'] }),
  });

  const hardDeletePricing = useMutation({
    mutationFn: ({ id, pricingId }: { id: string; pricingId: string }) =>
      hardDeleteInventoryPricing(id, pricingId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'inventory'] }),
  });

  return {
    list,
    create,
    addPricing,
    softDeleteItem,
    hardDeletePricing,
  };
}
