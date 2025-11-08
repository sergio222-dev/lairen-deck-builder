
> lairen-deck-builder@ supabase /home/sergio/code/lairen-deck-builder
> supabase "gen" "types" "--local"

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
      album_card_tags: {
        Row: {
          album_card_id: number | null
          id: number
          quantity: number
          tag_id: number | null
        }
        Insert: {
          album_card_id?: number | null
          id?: number
          quantity?: number
          tag_id?: number | null
        }
        Update: {
          album_card_id?: number | null
          id?: number
          quantity?: number
          tag_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "album_card_tags_album_card_id_fkey"
            columns: ["album_card_id"]
            isOneToOne: false
            referencedRelation: "album_cards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "album_card_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "album_tag"
            referencedColumns: ["id"]
          },
        ]
      }
      album_cards: {
        Row: {
          album_id: number
          card_id: number
          id: number
          quantity: number
        }
        Insert: {
          album_id: number
          card_id: number
          id?: number
          quantity?: number
        }
        Update: {
          album_id?: number
          card_id?: number
          id?: number
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "album_cards_album_id_fkey"
            columns: ["album_id"]
            isOneToOne: false
            referencedRelation: "albums"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "album_cards_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "cards"
            referencedColumns: ["id"]
          },
        ]
      }
      album_tag: {
        Row: {
          album_id: number
          id: number
          name: string
        }
        Insert: {
          album_id: number
          id?: number
          name: string
        }
        Update: {
          album_id?: number
          id?: number
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "album_tag_album_id_fkey"
            columns: ["album_id"]
            isOneToOne: false
            referencedRelation: "albums"
            referencedColumns: ["id"]
          },
        ]
      }
      albums: {
        Row: {
          current: number
          id: number
          name: string
          owner: string
          sets: string[]
          total: number
        }
        Insert: {
          current: number
          id?: number
          name: string
          owner: string
          sets: string[]
          total: number
        }
        Update: {
          current?: number
          id?: number
          name?: string
          owner?: string
          sets?: string[]
          total?: number
        }
        Relationships: []
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
      deck_card: {
        Row: {
          card: number
          deck: number
          quantity: number
          quantity_side: number
        }
        Insert: {
          card: number
          deck: number
          quantity?: number
          quantity_side?: number
        }
        Update: {
          card?: number
          deck?: number
          quantity?: number
          quantity_side?: number
        }
        Relationships: [
          {
            foreignKeyName: "deck_card_card_fkey"
            columns: ["card"]
            isOneToOne: false
            referencedRelation: "cards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deck_card_deck_fkey"
            columns: ["deck"]
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
          guardian: string | null
          id: number
          is_public: boolean
          name: string
          owner: string | null
          type_1: string | null
          type_2: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          deck_face?: number | null
          description?: string | null
          guardian?: string | null
          id?: number
          is_public?: boolean
          name: string
          owner?: string | null
          type_1?: string | null
          type_2?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          deck_face?: number | null
          description?: string | null
          guardian?: string | null
          id?: number
          is_public?: boolean
          name?: string
          owner?: string | null
          type_1?: string | null
          type_2?: string | null
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
        Relationships: []
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
      create_album: {
        Args: {
          album_name: string
          album_owner: string
          album_sets: string[]
          album_tags: string[]
        }
        Returns: number
      }
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

