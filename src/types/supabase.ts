export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string;
          name: string;
          category: 'Alimentos' | 'Bebidas' | 'Limpeza' | 'Higiene' | 'Pet' | 'Casa' | 'Farmácia' | 'Outros';
          default_unit: string;
          default_quantity: number;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          category: 'Alimentos' | 'Bebidas' | 'Limpeza' | 'Higiene' | 'Pet' | 'Casa' | 'Farmácia' | 'Outros';
          default_unit: string;
          default_quantity?: number;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          category?: 'Alimentos' | 'Bebidas' | 'Limpeza' | 'Higiene' | 'Pet' | 'Casa' | 'Farmácia' | 'Outros';
          default_unit?: string;
          default_quantity?: number;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      shopping_list_items: {
        Row: {
          id: string;
          product_id: string | null;
          name: string;
          quantity: number;
          unit: string;
          estimated_price: number | null;
          category: 'Alimentos' | 'Bebidas' | 'Limpeza' | 'Higiene' | 'Pet' | 'Casa' | 'Farmácia' | 'Outros';
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          product_id?: string | null;
          name: string;
          quantity?: number;
          unit: string;
          estimated_price?: number | null;
          category: 'Alimentos' | 'Bebidas' | 'Limpeza' | 'Higiene' | 'Pet' | 'Casa' | 'Farmácia' | 'Outros';
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string | null;
          name?: string;
          quantity?: number;
          unit?: string;
          estimated_price?: number | null;
          category?: 'Alimentos' | 'Bebidas' | 'Limpeza' | 'Higiene' | 'Pet' | 'Casa' | 'Farmácia' | 'Outros';
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      shopping_sessions: {
        Row: {
          id: string;
          started_at: string;
          finished_at: string | null;
          total_amount: number;
          status: 'active' | 'completed' | 'cancelled';
          created_at: string;
        };
        Insert: {
          id?: string;
          started_at?: string;
          finished_at?: string | null;
          total_amount?: number;
          status?: 'active' | 'completed' | 'cancelled';
          created_at?: string;
        };
        Update: {
          id?: string;
          started_at?: string;
          finished_at?: string | null;
          total_amount?: number;
          status?: 'active' | 'completed' | 'cancelled';
          created_at?: string;
        };
      };
      shopping_items: {
        Row: {
          id: string;
          shopping_session_id: string;
          product_id: string | null;
          name: string;
          quantity: number;
          unit: string;
          unit_price: number;
          total_price: number;
          category: string;
          notes: string | null;
        };
        Insert: {
          id?: string;
          shopping_session_id: string;
          product_id?: string | null;
          name: string;
          quantity: number;
          unit: string;
          unit_price: number;
          total_price: number;
          category: string;
          notes?: string | null;
        };
        Update: {
          id?: string;
          shopping_session_id?: string;
          product_id?: string | null;
          name?: string;
          quantity?: number;
          unit?: string;
          unit_price?: number;
          total_price?: number;
          category?: string;
          notes?: string | null;
        };
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
    CompositeTypes: {};
  };
}

export type Product = Database['public']['Tables']['products']['Row'];
export type ProductInsert = Database['public']['Tables']['products']['Insert'];
export type ProductUpdate = Database['public']['Tables']['products']['Update'];

export type ShoppingListItem = Database['public']['Tables']['shopping_list_items']['Row'];
export type ShoppingListItemInsert = Database['public']['Tables']['shopping_list_items']['Insert'];
export type ShoppingListItemUpdate = Database['public']['Tables']['shopping_list_items']['Update'];

export type ShoppingSession = Database['public']['Tables']['shopping_sessions']['Row'];
export type ShoppingSessionInsert = Database['public']['Tables']['shopping_sessions']['Insert'];
export type ShoppingSessionUpdate = Database['public']['Tables']['shopping_sessions']['Update'];

export type ShoppingItem = Database['public']['Tables']['shopping_items']['Row'];
export type ShoppingItemInsert = Database['public']['Tables']['shopping_items']['Insert'];
export type ShoppingItemUpdate = Database['public']['Tables']['shopping_items']['Update'];

export type Category = 'Alimentos' | 'Bebidas' | 'Limpeza' | 'Higiene' | 'Pet' | 'Casa' | 'Farmácia' | 'Outros';

export const CATEGORIES: Category[] = [
  'Alimentos',
  'Bebidas',
  'Limpeza',
  'Higiene',
  'Pet',
  'Casa',
  'Farmácia',
  'Outros',
];

export const UNITS = [
  'unidade',
  'kg',
  'g',
  'litro',
  'ml',
  'pacote',
  'caixa',
  'garrafa',
  'dúzia',
  'outro',
] as const;

export type Unit = typeof UNITS[number];