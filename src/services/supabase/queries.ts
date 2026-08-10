import { supabase } from './client';
import {
  Product,
  ProductInsert,
  ShoppingListItem,
  ShoppingListItemInsert,
  ShoppingListItemUpdate,
  ShoppingSession,
  ShoppingSessionInsert,
  ShoppingSessionUpdate,
  ShoppingItem,
  ShoppingItemInsert,
} from '@/types/supabase';

export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (filters: string) => [...productKeys.lists(), { filters }] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
};

export const shoppingListKeys = {
  all: ['shoppingList'] as const,
  lists: () => [...shoppingListKeys.all, 'list'] as const,
  list: (filters: string) => [...shoppingListKeys.lists(), { filters }] as const,
};

export const sessionKeys = {
  all: ['sessions'] as const,
  lists: () => [...sessionKeys.all, 'list'] as const,
  list: (filters: string) => [...sessionKeys.lists(), { filters }] as const,
  details: () => [...sessionKeys.all, 'detail'] as const,
  detail: (id: string) => [...sessionKeys.details(), id] as const,
  active: () => [...sessionKeys.all, 'active'] as const,
};

export const sessionItemsKeys = {
  all: ['sessionItems'] as const,
  lists: () => [...sessionItemsKeys.all, 'list'] as const,
  list: (sessionId: string) => [...sessionItemsKeys.lists(), sessionId] as const,
};

export async function fetchProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('name');
  if (error) throw error;
  return data ?? [];
}

export async function fetchShoppingList(): Promise<ShoppingListItem[]> {
  const { data, error } = await supabase
    .from('shopping_list_items')
    .select('*')
    .order('category')
    .order('created_at');
  if (error) throw error;
  return data ?? [];
}

export async function fetchCompletedSessions(): Promise<ShoppingSession[]> {
  const { data, error } = await supabase
    .from('shopping_sessions')
    .select('*')
    .eq('status', 'completed')
    .order('finished_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function fetchActiveSession(): Promise<ShoppingSession | null> {
  const { data, error } = await supabase
    .from('shopping_sessions')
    .select('*')
    .eq('status', 'active')
    .order('started_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function fetchSessionDetail(sessionId: string): Promise<ShoppingSession | null> {
  const { data, error } = await supabase
    .from('shopping_sessions')
    .select('*')
    .eq('id', sessionId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function fetchSessionItems(sessionId: string): Promise<ShoppingItem[]> {
  const { data, error } = await supabase
    .from('shopping_items')
    .select('*')
    .eq('shopping_session_id', sessionId)
    .order('created_at');
  if (error) throw error;
  return data ?? [];
}

export async function insertProduct(product: ProductInsert): Promise<Product> {
  const { data, error } = await supabase
    .from('products')
    .insert(product)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function insertShoppingListItem(item: ShoppingListItemInsert): Promise<ShoppingListItem> {
  const { data, error } = await supabase
    .from('shopping_list_items')
    .insert(item)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateShoppingListItem(id: string, updates: ShoppingListItemUpdate): Promise<ShoppingListItem> {
  const { data, error } = await supabase
    .from('shopping_list_items')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteShoppingListItem(id: string): Promise<void> {
  const { error } = await supabase
    .from('shopping_list_items')
    .delete()
    .eq('id', id);
  if (error) throw error;
}

export async function insertShoppingSession(session: ShoppingSessionInsert): Promise<ShoppingSession> {
  const { data, error } = await supabase
    .from('shopping_sessions')
    .insert(session)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateShoppingSession(id: string, updates: ShoppingSessionUpdate): Promise<ShoppingSession> {
  const { data, error } = await supabase
    .from('shopping_sessions')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function insertShoppingItems(items: ShoppingItemInsert[]): Promise<ShoppingItem[]> {
  const { data, error } = await supabase
    .from('shopping_items')
    .insert(items)
    .select();
  if (error) throw error;
  return data ?? [];
}

export async function updateShoppingItem(id: string, updates: Partial<ShoppingItemInsert>): Promise<ShoppingItem> {
  const { data, error } = await supabase
    .from('shopping_items')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function findProductByName(name: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .ilike('name', name)
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function searchProducts(query: string): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .ilike('name', `%${query}%`)
    .order('name')
    .limit(10);
  if (error) throw error;
  return data ?? [];
}