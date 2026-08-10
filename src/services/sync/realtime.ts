import { supabase } from '../supabase/client';
import type { RealtimeChannel } from '@supabase/supabase-js';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { shoppingListKeys, sessionKeys, sessionItemsKeys } from '../supabase/queries';
import type { ShoppingListItem, ShoppingSession, ShoppingItem } from '@/types/supabase';

export function useRealtimeSync() {
  const queryClient = useQueryClient();
  const channelsRef = useRef<RealtimeChannel[]>([]);

  useEffect(() => {
    const listChannel = supabase
      .channel('shopping_list_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'shopping_list_items' },
        (payload) => {
          queryClient.setQueryData<ShoppingListItem[]>(shoppingListKeys.lists(), (old) => {
            if (!old) return [];
            const items = [...old];
            switch (payload.eventType) {
              case 'INSERT': {
                const newItem = payload.new as ShoppingListItem;
                if (items.some((i) => i.id === newItem.id)) return items;
                return [...items, newItem];
              }
              case 'UPDATE': {
                const updated = payload.new as ShoppingListItem;
                return items.map((i) => (i.id === updated.id ? updated : i));
              }
              case 'DELETE': {
                const deleted = payload.old as ShoppingListItem;
                return items.filter((i) => i.id !== deleted.id);
              }
              default:
                return items;
            }
          });
        }
      )
      .subscribe();

    const sessionChannel = supabase
      .channel('session_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'shopping_sessions' },
        (payload) => {
          queryClient.invalidateQueries({ queryKey: sessionKeys.active() });
          queryClient.invalidateQueries({ queryKey: sessionKeys.list('completed') });
        }
      )
      .subscribe();

    const sessionItemsChannel = supabase
      .channel('session_items_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'shopping_items' },
        (payload) => {
          const sessionId = (payload.new as ShoppingItem)?.shopping_session_id ?? (payload.old as ShoppingItem)?.shopping_session_id;
          if (sessionId) {
            queryClient.invalidateQueries({ queryKey: sessionItemsKeys.list(sessionId) });
          }
        }
      )
      .subscribe();

    channelsRef.current = [listChannel, sessionChannel, sessionItemsChannel];

    return () => {
      for (const channel of channelsRef.current) {
        supabase.removeChannel(channel);
      }
      channelsRef.current = [];
    };
  }, [queryClient]);
}