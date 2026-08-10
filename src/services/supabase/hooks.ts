import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryKey,
} from '@tanstack/react-query';
import {
  fetchProducts,
  fetchShoppingList,
  fetchCompletedSessions,
  fetchActiveSession,
  fetchSessionDetail,
  fetchSessionItems,
  insertProduct,
  insertShoppingListItem,
  updateShoppingListItem,
  deleteShoppingListItem,
  insertShoppingSession,
  updateShoppingSession,
  insertShoppingItems,
  updateShoppingItem,
  findProductByName,
  searchProducts,
} from './queries';
import {
  productKeys,
  shoppingListKeys,
  sessionKeys,
  sessionItemsKeys,
} from './queries';
import type {
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

export function useProducts() {
  return useQuery({
    queryKey: productKeys.lists(),
    queryFn: fetchProducts,
    staleTime: 5 * 60 * 1000,
  });
}

export function useShoppingList() {
  return useQuery({
    queryKey: shoppingListKeys.lists(),
    queryFn: fetchShoppingList,
    staleTime: 30 * 1000,
  });
}

export function useCompletedSessions() {
  return useQuery({
    queryKey: sessionKeys.list('completed'),
    queryFn: fetchCompletedSessions,
    staleTime: 60 * 1000,
  });
}

export function useActiveSession() {
  return useQuery({
    queryKey: sessionKeys.active(),
    queryFn: fetchActiveSession,
    staleTime: 10 * 1000,
  });
}

export function useSessionDetail(sessionId: string) {
  return useQuery({
    queryKey: sessionKeys.detail(sessionId),
    queryFn: () => fetchSessionDetail(sessionId),
    enabled: !!sessionId,
    staleTime: 60 * 1000,
  });
}

export function useSessionItems(sessionId: string) {
  return useQuery({
    queryKey: sessionItemsKeys.list(sessionId),
    queryFn: () => fetchSessionItems(sessionId),
    enabled: !!sessionId,
    staleTime: 60 * 1000,
  });
}

export function useSearchProducts(query: string) {
  return useQuery({
    queryKey: productKeys.list(query),
    queryFn: () => searchProducts(query),
    enabled: query.length >= 2,
    staleTime: 60 * 1000,
  });
}

export function useFindProductByName(name: string) {
  return useQuery({
    queryKey: productKeys.detail(name),
    queryFn: () => findProductByName(name),
    enabled: !!name,
    staleTime: 60 * 1000,
  });
}

export function useAddProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (product: ProductInsert) => insertProduct(product),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
}

export function useAddListItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (item: ShoppingListItemInsert) => insertShoppingListItem(item),
    onMutate: async (newItem) => {
      await queryClient.cancelQueries({ queryKey: shoppingListKeys.lists() });
      const previous = queryClient.getQueryData<ShoppingListItem[]>(shoppingListKeys.lists());
      queryClient.setQueryData<ShoppingListItem[]>(shoppingListKeys.lists(), (old) => [
        ...(old ?? []),
        { ...newItem, id: `temp-${Date.now()}`, created_at: new Date().toISOString(), updated_at: new Date().toISOString() } as ShoppingListItem,
      ]);
      return { previous };
    },
    onError: (err, variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(shoppingListKeys.lists(), context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: shoppingListKeys.lists() });
    },
  });
}

export function useUpdateListItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: ShoppingListItemUpdate }) =>
      updateShoppingListItem(id, updates),
    onMutate: async ({ id, updates }) => {
      await queryClient.cancelQueries({ queryKey: shoppingListKeys.lists() });
      const previous = queryClient.getQueryData<ShoppingListItem[]>(shoppingListKeys.lists());
      queryClient.setQueryData<ShoppingListItem[]>(shoppingListKeys.lists(), (old) =>
        (old ?? []).map((item) =>
          item.id === id ? { ...item, ...updates, updated_at: new Date().toISOString() } : item
        )
      );
      return { previous };
    },
    onError: (err, variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(shoppingListKeys.lists(), context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: shoppingListKeys.lists() });
    },
  });
}

export function useDeleteListItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteShoppingListItem(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: shoppingListKeys.lists() });
      const previous = queryClient.getQueryData<ShoppingListItem[]>(shoppingListKeys.lists());
      queryClient.setQueryData<ShoppingListItem[]>(shoppingListKeys.lists(), (old) =>
        (old ?? []).filter((item) => item.id !== id)
      );
      return { previous };
    },
    onError: (err, variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(shoppingListKeys.lists(), context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: shoppingListKeys.lists() });
    },
  });
}

export function useStartPurchase() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (listItems: ShoppingListItem[]) => {
      const session = await insertShoppingSession({
        started_at: new Date().toISOString(),
        status: 'active',
        total_amount: 0,
      });
      const sessionItems: ShoppingItemInsert[] = listItems.map((item) => ({
        shopping_session_id: session.id,
        product_id: item.product_id,
        name: item.name,
        quantity: item.quantity,
        unit: item.unit,
        unit_price: 0,
        total_price: 0,
        category: item.category,
        notes: item.notes,
      }));
      await insertShoppingItems(sessionItems);
      return session;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sessionKeys.active() });
      queryClient.invalidateQueries({ queryKey: shoppingListKeys.lists() });
    },
  });
}

export function useUpdatePurchaseItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<ShoppingItemInsert> }) =>
      updateShoppingItem(id, updates),
    onMutate: async ({ id, updates }) => {
      await queryClient.cancelQueries({ queryKey: sessionItemsKeys.lists() });
      const previous = queryClient.getQueryData<ShoppingItem[]>(sessionItemsKeys.lists());
      queryClient.setQueryData<ShoppingItem[]>(sessionItemsKeys.lists(), (old) =>
        (old ?? []).map((item) => (item.id === id ? { ...item, ...updates } : item))
      );
      return { previous };
    },
    onError: (err, variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(sessionItemsKeys.lists(), context.previous);
      }
    },
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({ queryKey: sessionItemsKeys.list(variables.id.split('-')[0]) });
    },
  });
}

export function useFinishPurchase() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      sessionId,
      totalAmount,
      purchasedItemIds,
    }: {
      sessionId: string;
      totalAmount: number;
      purchasedItemIds: string[];
    }) => {
      await updateShoppingSession(sessionId, {
        finished_at: new Date().toISOString(),
        total_amount: totalAmount,
        status: 'completed',
      });
      if (purchasedItemIds.length > 0) {
        await supabase
          .from('shopping_list_items')
          .delete()
          .in('id', purchasedItemIds);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sessionKeys.active() });
      queryClient.invalidateQueries({ queryKey: sessionKeys.list('completed') });
      queryClient.invalidateQueries({ queryKey: shoppingListKeys.lists() });
    },
  });
}

export function useBuyAgain() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (sessionId: string) => {
      const items = await fetchSessionItems(sessionId);
      const listItems: ShoppingListItemInsert[] = items.map((item) => ({
        product_id: item.product_id,
        name: item.name,
        quantity: item.quantity,
        unit: item.unit,
        estimated_price: item.unit_price > 0 ? item.unit_price : null,
        category: item.category as any,
        notes: item.notes,
      }));
      for (const item of listItems) {
        await insertShoppingListItem(item);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: shoppingListKeys.lists() });
    },
  });
}

import { supabase } from './client';