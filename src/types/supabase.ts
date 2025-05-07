export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      transactions: {
        Row: {
          id: string
          user_id: string
          amount: number
          category: string
          description: string | null
          date: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          amount: number
          category: string
          description?: string | null
          date?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          amount?: number
          category?: string
          description?: string | null
          date?: string
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          icon: string
          color: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          icon: string
          color: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          icon?: string
          color?: string
          created_at?: string
        }
      }
      budgets: {
        Row: {
          id: string
          category_id: string
          amount: number
          period: string
          created_at: string
        }
        Insert: {
          id?: string
          category_id: string
          amount: number
          period: string
          created_at?: string
        }
        Update: {
          id?: string
          category_id?: string
          amount?: number
          period?: string
          created_at?: string
        }
      }
      bill: {
        Row: {
          id: string
          account: string
          amount: number
          date: string
          description: string | null
          created_at?: string
        }
        Insert: {
          id?: string
          account: string
          amount: number
          date: string
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          account?: string
          amount?: number
          date?: string
          description?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 