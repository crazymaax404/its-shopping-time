import { useNetInfo } from '@react-native-community/netinfo';
import { useEffect, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase/client';
import { useUIStore } from '@/stores/uiStore';
import type {
  ShoppingListItemInsert,
  ShoppingListItemUpdate,
  ShoppingItemInsert,
} from '@/types/supabase';

interface QueuedMutation {
  id: string;
  type: 'insert_list' | 'update_list' | 'delete_list' | 'update_session_item';
  payload: any;
  timestamp: number;
}

const QUEUE_KEY = 'offline_mutation_queue';

export function useOfflineQueue() {
  const queryClient = useQueryClient();
  const isConnected = useNetInfo().isConnected;
  const { activeSessionId } = useUIStore();

  const processQueue = useCallback(async () => {
    if (!isConnected) return;

    const stored = localStorage.getItem(QUEUE_KEY);
    if (!stored) return;

    const queue: QueuedMutation[] = JSON.parse(stored);
    if (queue.length === 0) return;

    const remaining: QueuedMutation[] = [];

    for (const mutation of queue) {
      try {
        switch (mutation.type) {
          case 'insert_list': {
            await supabase.from('shopping_list_items').insert(mutation.payload);
            break;
          }
          case 'update_list': {
            await supabase
              .from('shopping_list_items')
              .update({
                ...mutation.payload.updates,
                updated_at: new Date().toISOString(),
              })
              .eq('id', mutation.payload.id);
            break;
          }
          case 'delete_list': {
            await supabase
              .from('shopping_list_items')
              .delete()
              .eq('id', mutation.payload.id);
            break;
          }
          case 'update_session_item': {
            await supabase
              .from('shopping_items')
              .update(mutation.payload.updates)
              .eq('id', mutation.payload.id);
            break;
          }
        }
      } catch (error) {
        remaining.push(mutation);
      }
    }

    if (remaining.length > 0) {
      localStorage.setItem(QUEUE_KEY, JSON.stringify(remaining));
    } else {
      localStorage.removeItem(QUEUE_KEY);
    }

    queryClient.invalidateQueries({ queryKey: ['shoppingList'] });
    if (activeSessionId) {
      queryClient.invalidateQueries({
        queryKey: ['sessionItems', activeSessionId],
      });
    }
  }, [isConnected, queryClient, activeSessionId]);

  useEffect(() => {
    if (isConnected) {
      processQueue();
    }
  }, [isConnected, processQueue]);

  const queueMutation = useCallback(
    (mutation: Omit<QueuedMutation, 'id' | 'timestamp'>) => {
      const stored = localStorage.getItem(QUEUE_KEY);
      const queue: QueuedMutation[] = stored ? JSON.parse(stored) : [];
      queue.push({
        ...mutation,
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        timestamp: Date.now(),
      });
      localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
    },
    [],
  );

  return { queueMutation, processQueue };
}

export function useOfflineMutations() {
  const { queueMutation } = useOfflineQueue();

  const insertListItemOffline = useCallback(
    (item: ShoppingListItemInsert) => {
      queueMutation({ type: 'insert_list', payload: item });
    },
    [queueMutation],
  );

  const updateListItemOffline = useCallback(
    (id: string, updates: ShoppingListItemUpdate) => {
      queueMutation({ type: 'update_list', payload: { id, updates } });
    },
    [queueMutation],
  );

  const deleteListItemOffline = useCallback(
    (id: string) => {
      queueMutation({ type: 'delete_list', payload: { id } });
    },
    [queueMutation],
  );

  const updateSessionItemOffline = useCallback(
    (id: string, updates: Partial<ShoppingItemInsert>) => {
      queueMutation({ type: 'update_session_item', payload: { id, updates } });
    },
    [queueMutation],
  );

  return {
    insertListItemOffline,
    updateListItemOffline,
    deleteListItemOffline,
    updateSessionItemOffline,
  };
}
