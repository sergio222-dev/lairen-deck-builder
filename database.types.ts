export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      card_collection: {
        Row: {
          card_id: number
          collection_id: number
          id: number
          quantity: number
        }
        Insert: {
          card_id: number
          collection_id: number
          id?: number
          quantity: number
        }
        Update: {
          card_id?: number
          collection_id?: number
          id?: number
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "card_collection_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "cards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "card_collection_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "collections_decks"
            referencedColumns: ["id"]
          },
        ]
      }
      cards: {
        Row: {
          cost: string
          created_at: string
          id: number
          image: string
          name: string
          rarity: string
          set: string
          subtype: string
          subtype2: string
          supertype: string
          text: string
          type: string
          updated_at: string
        }
        Insert: {
          cost?: string
          created_at?: string
          id?: number
          image?: string
          name?: string
          rarity?: string
          set?: string
          subtype?: string
          subtype2?: string
          supertype?: string
          text?: string
          type?: string
          updated_at?: string
        }
        Update: {
          cost?: string
          created_at?: string
          id?: number
          image?: string
          name?: string
          rarity?: string
          set?: string
          subtype?: string
          subtype2?: string
          supertype?: string
          text?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      collections_decks: {
        Row: {
          deck_id: number
          id: number
          type: string
        }
        Insert: {
          deck_id: number
          id?: number
          type: string
        }
        Update: {
          deck_id?: number
          id?: number
          type?: string
        }
        Relationships: []
      }
      decks: {
        Row: {
          created_at: string
          id: number
          isPublic: boolean
          likes: number
          name: string
          owner: string
          type1: string | null
          type2: string | null
          updated_aat: string
        }
        Insert: {
          created_at?: string
          id?: number
          isPublic?: boolean
          likes: number
          name: string
          owner: string
          type1?: string | null
          type2?: string | null
          updated_aat?: string
        }
        Update: {
          created_at?: string
          id?: number
          isPublic?: boolean
          likes?: number
          name?: string
          owner?: string
          type1?: string | null
          type2?: string | null
          updated_aat?: string
        }
        Relationships: []
      }
    }
    Views: {
      deck_types: {
        Row: {
          subtype: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
