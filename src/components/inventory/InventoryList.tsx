import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { InventoryItem } from '@/lib/hooks/useInventory';
import { formatDate } from '@/lib/utils';
import { toast } from 'sonner';

type InventoryListProps = {
  items: InventoryItem[];
  onRemove: (id: string) => void;
};

export function InventoryList({ items, onRemove }: InventoryListProps) {
  const handleRemove = (id: string) => {
    onRemove(id);
    toast.success('Item removed');
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        <p>No inventory items yet. Add your first item above.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 mt-6">
      <h2 className="text-xl font-semibold">Inventory Items</h2>
      
      <div className="grid gap-4">
        {items.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            <CardHeader className="py-3 px-4 bg-gray-50">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-medium">{item.name}</CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  onClick={() => handleRemove(item.id)}
                >
                  Remove
                </Button>
              </div>
            </CardHeader>
            <CardContent className="py-3 px-4">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-sm text-gray-500">Quantity</p>
                  <p className="font-medium">
                    {item.quantity} {item.unit}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-medium">{formatDate(item.date)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 