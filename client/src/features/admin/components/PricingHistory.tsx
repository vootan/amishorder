interface PricingHistoryProps {
  pricing: any[];
  itemId: string;
  onClose: () => void;
  onDeletePricing: (pricingId: string) => Promise<void>;
  isDeleting: boolean;
}

export default function PricingHistory({
  pricing,
  itemId,
  onClose,
  onDeletePricing,
  isDeleting,
}: PricingHistoryProps) {
  if (!pricing) return null;

  const sorted = (pricing || []).slice().sort((a: any, b: any) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded shadow-lg w-96 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-medium">Pricing History</h3>
          <button className="text-gray-500" onClick={onClose}>Close</button>
        </div>
        <div className="space-y-2 max-h-80 overflow-auto">
          {sorted.map((r: any, idx: number) => (
            <div key={idx} className="flex justify-between border-b pb-2">
              <div>
                <div className="text-sm font-medium">${r.price}</div>
                <div className="text-xs text-gray-500">{new Date(r.startDate).toLocaleDateString()} — {r.endDate ? new Date(r.endDate).toLocaleDateString() : 'present'}</div>
              </div>
              <div>
                <button
                  className="text-sm text-red-600 disabled:text-gray-400"
                  disabled={isDeleting || !r._id}
                  onClick={() => {
                    if (!r._id) return;
                    void onDeletePricing(String(r._id));
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-2">Item: {itemId}</p>
      </div>
    </div>
  );
}
