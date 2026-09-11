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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      guests: {
        Row: {
          created_at: string
          group_label: string | null
          id: string
          invite_code: string | null
          name: string
          notes: string | null
          plus_ones: number
          project_id: string
          qr_path: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          group_label?: string | null
          id?: string
          invite_code?: string | null
          name: string
          notes?: string | null
          plus_ones?: number
          project_id: string
          qr_path?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          group_label?: string | null
          id?: string
          invite_code?: string | null
          name?: string
          notes?: string | null
          plus_ones?: number
          project_id?: string
          qr_path?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "guests_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      offline_templates: {
        Row: {
          active: boolean
          category: string | null
          cover_path: string | null
          created_at: string
          description: string | null
          files: Json
          id: string
          name: string
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          active?: boolean
          category?: string | null
          cover_path?: string | null
          created_at?: string
          description?: string | null
          files?: Json
          id?: string
          name: string
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          active?: boolean
          category?: string | null
          cover_path?: string | null
          created_at?: string
          description?: string | null
          files?: Json
          id?: string
          name?: string
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          active: boolean
          avatar_url: string | null
          created_at: string
          full_name: string
          id: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          active?: boolean
          avatar_url?: string | null
          created_at?: string
          full_name?: string
          id: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          active?: boolean
          avatar_url?: string | null
          created_at?: string
          full_name?: string
          id?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          bride_name: string
          cover_url: string | null
          created_at: string
          data: Json
          event_date: string | null
          groom_name: string
          id: string
          music_url: string | null
          owner_id: string
          slug: string
          status: Database["public"]["Enums"]["project_status"]
          template_slug: string
          updated_at: string
        }
        Insert: {
          bride_name?: string
          cover_url?: string | null
          created_at?: string
          data?: Json
          event_date?: string | null
          groom_name?: string
          id?: string
          music_url?: string | null
          owner_id: string
          slug: string
          status?: Database["public"]["Enums"]["project_status"]
          template_slug: string
          updated_at?: string
        }
        Update: {
          bride_name?: string
          cover_url?: string | null
          created_at?: string
          data?: Json
          event_date?: string | null
          groom_name?: string
          id?: string
          music_url?: string | null
          owner_id?: string
          slug?: string
          status?: Database["public"]["Enums"]["project_status"]
          template_slug?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_template_slug_fkey"
            columns: ["template_slug"]
            isOneToOne: false
            referencedRelation: "templates"
            referencedColumns: ["slug"]
          },
        ]
      }
      rsvps: {
        Row: {
          attendance: Database["public"]["Enums"]["rsvp_attendance"]
          created_at: string
          guest_id: string | null
          head_count: number
          id: string
          message: string | null
          name: string
          project_id: string
        }
        Insert: {
          attendance: Database["public"]["Enums"]["rsvp_attendance"]
          created_at?: string
          guest_id?: string | null
          head_count?: number
          id?: string
          message?: string | null
          name: string
          project_id: string
        }
        Update: {
          attendance?: Database["public"]["Enums"]["rsvp_attendance"]
          created_at?: string
          guest_id?: string | null
          head_count?: number
          id?: string
          message?: string | null
          name?: string
          project_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "rsvps_guest_id_fkey"
            columns: ["guest_id"]
            isOneToOne: false
            referencedRelation: "guests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rsvps_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      studio_settings: {
        Row: {
          contact_email: string | null
          contact_phone: string | null
          default_template: string | null
          features: Json
          id: number
          studio_name: string
          updated_at: string
          whatsapp: string | null
        }
        Insert: {
          contact_email?: string | null
          contact_phone?: string | null
          default_template?: string | null
          features?: Json
          id?: number
          studio_name?: string
          updated_at?: string
          whatsapp?: string | null
        }
        Update: {
          contact_email?: string | null
          contact_phone?: string | null
          default_template?: string | null
          features?: Json
          id?: number
          studio_name?: string
          updated_at?: string
          whatsapp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "studio_settings_default_template_fkey"
            columns: ["default_template"]
            isOneToOne: false
            referencedRelation: "templates"
            referencedColumns: ["slug"]
          },
        ]
      }
      templates: {
        Row: {
          active: boolean
          created_at: string
          description: string | null
          manifest: Json
          name: string
          slug: string
          thumbnail_url: string | null
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          description?: string | null
          manifest?: Json
          name: string
          slug: string
          thumbnail_url?: string | null
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          description?: string | null
          manifest?: Json
          name?: string
          slug?: string
          thumbnail_url?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      wishes: {
        Row: {
          approved: boolean
          created_at: string
          id: string
          message: string
          name: string
          project_id: string
        }
        Insert: {
          approved?: boolean
          created_at?: string
          id?: string
          message: string
          name: string
          project_id: string
        }
        Update: {
          approved?: boolean
          created_at?: string
          id?: string
          message?: string
          name?: string
          project_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wishes_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_manage_project_file: {
        Args: { _bucket: string; _name: string }
        Returns: boolean
      }
      current_user_is_admin: { Args: never; Returns: boolean }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "wo"
      project_status: "draft" | "published" | "archived"
      rsvp_attendance: "hadir" | "tidak_hadir" | "ragu"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "wo"],
      project_status: ["draft", "published", "archived"],
      rsvp_attendance: ["hadir", "tidak_hadir", "ragu"],
    },
  },
} as const
