import { ShoppingListItemInsert } from '@/types/supabase';

export function dedupeItems(
  existing: ShoppingListItemInsert[],
  incoming: ShoppingListItemInsert[]
): ShoppingListItemInsert[] {
  const map = new Map<string, ShoppingListItemInsert>();
  
  for (const item of existing) {
    const key = item.name.toLowerCase().trim();
    map.set(key, { ...item });
  }
  
  for (const item of incoming) {
    const key = item.name.toLowerCase().trim();
    const existingItem = map.get(key);
    if (existingItem) {
      existingItem.quantity += item.quantity;
    } else {
      map.set(key, { ...item });
    }
  }
  
  return Array.from(map.values());
}