
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.2 (db9da0b)"
  }
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
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
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
      album_card: {
        Row: {
          card: number
          created_at: string
          id: number
          owner: string
          quantity: number
          tag: number | null
          updated_at: string
        }
        Insert: {
          card: number
          created_at?: string
          id?: number
          owner: string
          quantity?: number
          tag?: number | null
          updated_at?: string
        }
        Update: {
          card?: number
          created_at?: string
          id?: number
          owner?: string
          quantity?: number
          tag?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "album_card_fkey"
            columns: ["card"]
            isOneToOne: false
            referencedRelation: "cards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "album_card_tag_fkey"
            columns: ["tag"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
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
          clarifications: string | null
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
          clarifications?: string | null
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
          clarifications?: string | null
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
      tags: {
        Row: {
          created_at: string
          id: number
          name: string
          owner: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: number
          name: string
          owner: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: number
          name?: string
          owner?: string
          updated_at?: string
        }
        Relationships: []
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
      card_supertypes: {
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
      dominion: {
        Row: {
          name: string | null
        }
        Relationships: []
      }
      unit_types: {
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const
