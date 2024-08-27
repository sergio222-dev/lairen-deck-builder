export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
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
          thumbnail: string
          type: string
          updated_at: string
        }
        Insert: {
          cost?: string
          created_at?: string
          id?: number
          image?: string
          name: string
          rarity?: string
          set?: string
          subtype?: string
          subtype2?: string
          supertype?: string
          text?: string
          thumbnail?: string
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
          thumbnail?: string
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
        Relationships: [
          {
            foreignKeyName: "collections_decks_deck_id_fkey"
            columns: ["deck_id"]
            isOneToOne: false
            referencedRelation: "decks"
            referencedColumns: ["id"]
          },
        ]
      }
      decks: {
        Row: {
          created_at: string
          deck_face: number | null
          description: string | null
          id: number
          is_public: boolean
          likes: number
          name: string
          owner: string
          type1: string | null
          type2: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          deck_face?: number | null
          description?: string | null
          id?: number
          is_public?: boolean
          likes: number
          name: string
          owner: string
          type1?: string | null
          type2?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          deck_face?: number | null
          description?: string | null
          id?: number
          is_public?: boolean
          likes?: number
          name?: string
          owner?: string
          type1?: string | null
          type2?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "decks_deck_face_fkey"
            columns: ["deck_face"]
            isOneToOne: false
            referencedRelation: "cards"
            referencedColumns: ["id"]
          },
        ]
      }
      users_likes: {
        Row: {
          deck_id: number
          user_id: string
        }
        Insert: {
          deck_id: number
          user_id: string
        }
        Update: {
          deck_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_likes_deck_id_fkey"
            columns: ["deck_id"]
            isOneToOne: false
            referencedRelation: "decks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "users_likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      card_rarity: {
        Row: {
          name: string | null
        }
        Relationships: []
      }
      card_sets: {
        Row: {
          name: string | null
        }
        Relationships: []
      }
      card_subtypes: {
        Row: {
          name: string | null
        }
        Relationships: []
      }
      card_types: {
        Row: {
          name: string | null
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
