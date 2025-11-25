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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      divisions: {
        Row: {
          created_at: string | null
          id: string
          name: string
          total_points: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          total_points?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          total_points?: number | null
        }
        Relationships: []
      }
      events: {
        Row: {
          created_at: string | null
          icon: string | null
          id: string
          name: string
          status: string | null
          type: string
        }
        Insert: {
          created_at?: string | null
          icon?: string | null
          id: string
          name: string
          status?: string | null
          type: string
        }
        Update: {
          created_at?: string | null
          icon?: string | null
          id?: string
          name?: string
          status?: string | null
          type?: string
        }
        Relationships: []
      }
      fixtures: {
        Row: {
          created_at: string | null
          division_a: string
          division_b: string
          event_id: string
          id: string
          notes: string | null
          phase: string | null
          scheduled_date: string | null
          scheduled_time: string | null
          status: string | null
          updated_at: string | null
          venue: string | null
        }
        Insert: {
          created_at?: string | null
          division_a: string
          division_b: string
          event_id: string
          id?: string
          notes?: string | null
          phase?: string | null
          scheduled_date?: string | null
          scheduled_time?: string | null
          status?: string | null
          updated_at?: string | null
          venue?: string | null
        }
        Update: {
          created_at?: string | null
          division_a?: string
          division_b?: string
          event_id?: string
          id?: string
          notes?: string | null
          phase?: string | null
          scheduled_date?: string | null
          scheduled_time?: string | null
          status?: string | null
          updated_at?: string | null
          venue?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fixtures_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      matches: {
        Row: {
          created_at: string | null
          division_a: string
          division_b: string
          event_id: string
          fixture_id: string | null
          game_points_a: number | null
          game_points_b: number | null
          id: string
          match_data: Json | null
          match_date: string | null
          match_points_a: number | null
          match_points_b: number | null
          match_time: string | null
          phase: string | null
          result: string | null
          winner: string | null
        }
        Insert: {
          created_at?: string | null
          division_a: string
          division_b: string
          event_id: string
          fixture_id?: string | null
          game_points_a?: number | null
          game_points_b?: number | null
          id?: string
          match_data?: Json | null
          match_date?: string | null
          match_points_a?: number | null
          match_points_b?: number | null
          match_time?: string | null
          phase?: string | null
          result?: string | null
          winner?: string | null
        }
        Update: {
          created_at?: string | null
          division_a?: string
          division_b?: string
          event_id?: string
          fixture_id?: string | null
          game_points_a?: number | null
          game_points_b?: number | null
          id?: string
          match_data?: Json | null
          match_date?: string | null
          match_points_a?: number | null
          match_points_b?: number | null
          match_time?: string | null
          phase?: string | null
          result?: string | null
          winner?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "matches_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_fixture_id_fkey"
            columns: ["fixture_id"]
            isOneToOne: false
            referencedRelation: "fixtures"
            referencedColumns: ["id"]
          },
        ]
      }
      standings: {
        Row: {
          division: string
          drawn: number | null
          event_id: string
          game_points: number | null
          id: string
          lost: number | null
          match_losses: number | null
          match_points: number | null
          match_wins: number | null
          played: number | null
          points: number | null
          position: number | null
          updated_at: string | null
          won: number | null
        }
        Insert: {
          division: string
          drawn?: number | null
          event_id: string
          game_points?: number | null
          id?: string
          lost?: number | null
          match_losses?: number | null
          match_points?: number | null
          match_wins?: number | null
          played?: number | null
          points?: number | null
          position?: number | null
          updated_at?: string | null
          won?: number | null
        }
        Update: {
          division?: string
          drawn?: number | null
          event_id?: string
          game_points?: number | null
          id?: string
          lost?: number | null
          match_losses?: number | null
          match_points?: number | null
          match_wins?: number | null
          played?: number | null
          points?: number | null
          position?: number | null
          updated_at?: string | null
          won?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "standings_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      tt_tie_matches: {
        Row: {
          created_at: string | null
          id: string
          match_id: string
          match_number: number
          match_type: string
          score: string | null
          team_a_players: string
          team_b_players: string
          tie_id: string
          winner: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          match_id: string
          match_number: number
          match_type: string
          score?: string | null
          team_a_players: string
          team_b_players: string
          tie_id: string
          winner: string
        }
        Update: {
          created_at?: string | null
          id?: string
          match_id?: string
          match_number?: number
          match_type?: string
          score?: string | null
          team_a_players?: string
          team_b_players?: string
          tie_id?: string
          winner?: string
        }
        Relationships: [
          {
            foreignKeyName: "tt_tie_matches_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
        ]
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
  public: {
    Enums: {},
  },
} as const
