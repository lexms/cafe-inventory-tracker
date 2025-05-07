import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { InventoryItem } from '@/lib/hooks/useInventory';
import { getTodayDate } from '@/lib/utils';
import { toast } from 'sonner';

const formSchema = z.object({
  name: z.string().min(1, { message: 'Item name is required' }),
  quantity: z.coerce.number().min(0, { message: 'Quantity must be at least 0' }),
  unit: z.string().min(1, { message: 'Unit is required' }),
  date: z.string().min(1, { message: 'Date is required' }),
});

type FormValues = z.infer<typeof formSchema>;

type InventoryFormProps = {
  onSubmit: (data: Omit<InventoryItem, 'id' | 'createdAt'>) => void;
};

export function InventoryForm({ onSubmit }: InventoryFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      quantity: 1,
      unit: '',
      date: getTodayDate(),
    },
  });

  const handleSubmit = (data: FormValues) => {
    onSubmit(data);
    form.reset({
      name: '',
      quantity: 1,
      unit: '',
      date: getTodayDate(),
    });
    toast.success('Item added successfully');
  };

  const commonUnits = ['Box', 'Bag', 'Bottle', 'Can', 'Carton', 'Case', 'Container', 'Each', 'Gallon', 'Jar', 'kg', 'lbs', 'Liter', 'Pack', 'Piece'];
  const [showUnitSuggestions, setShowUnitSuggestions] = useState(false);
  const [filteredUnits, setFilteredUnits] = useState(commonUnits);

  const handleUnitChange = (value: string) => {
    form.setValue('unit', value);
    setFilteredUnits(
      commonUnits.filter(unit => unit.toLowerCase().includes(value.toLowerCase()))
    );
    setShowUnitSuggestions(value.length > 0);
  };

  const selectUnit = (unit: string) => {
    form.setValue('unit', unit);
    setShowUnitSuggestions(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Add Inventory Item</h2>
        
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Item Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Oat Milk" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantity</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min={0} 
                    step={1} 
                    {...field} 
                    onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="unit"
            render={({ field }) => (
              <FormItem className="relative">
                <FormLabel>Unit</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="e.g. Carton" 
                    {...field} 
                    onChange={(e) => {
                      field.onChange(e);
                      handleUnitChange(e.target.value);
                    }}
                    onFocus={() => setShowUnitSuggestions(true)}
                  />
                </FormControl>
                {showUnitSuggestions && filteredUnits.length > 0 && (
                  <div className="absolute z-10 w-full bg-white border rounded-md mt-1 max-h-40 overflow-y-auto shadow-lg">
                    {filteredUnits.map(unit => (
                      <div 
                        key={unit} 
                        className="px-3 py-1 cursor-pointer hover:bg-gray-100"
                        onClick={() => selectUnit(unit)}
                      >
                        {unit}
                      </div>
                    ))}
                  </div>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" className="w-full mt-4">Add Item</Button>
      </form>
    </Form>
  );
} 