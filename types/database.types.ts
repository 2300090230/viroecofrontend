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
      address: {
        Row: {
          address_type: string | null
          city: string | null
          country: string | null
          door_number: string | null
          gmail: string | null
          id: number
          state: string | null
          street: string | null
          zip_code: string | null
        }
        Insert: {
          address_type?: string | null
          city?: string | null
          country?: string | null
          door_number?: string | null
          gmail?: string | null
          id?: number
          state?: string | null
          street?: string | null
          zip_code?: string | null
        }
        Update: {
          address_type?: string | null
          city?: string | null
          country?: string | null
          door_number?: string | null
          gmail?: string | null
          id?: number
          state?: string | null
          street?: string | null
          zip_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "address_gmail_fkey"
            columns: ["gmail"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["gmail"]
          },
        ]
      }
      audit_log: {
        Row: {
          action: string
          details: string | null
          entity_id: string | null
          entity_type: string
          id: number
          ip_address: string | null
          performed_by: string
          timestamp: string | null
        }
        Insert: {
          action: string
          details?: string | null
          entity_id?: string | null
          entity_type: string
          id?: number
          ip_address?: string | null
          performed_by: string
          timestamp?: string | null
        }
        Update: {
          action?: string
          details?: string | null
          entity_id?: string | null
          entity_type?: string
          id?: number
          ip_address?: string | null
          performed_by?: string
          timestamp?: string | null
        }
        Relationships: []
      }
      cart: {
        Row: {
          gmail: string | null
          id: number
        }
        Insert: {
          gmail?: string | null
          id?: number
        }
        Update: {
          gmail?: string | null
          id?: number
        }
        Relationships: [
          {
            foreignKeyName: "cart_gmail_fkey"
            columns: ["gmail"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["gmail"]
          },
        ]
      }
      cart_item: {
        Row: {
          cart_id: number | null
          id: number
          product_id: number | null
          quantity: number | null
        }
        Insert: {
          cart_id?: number | null
          id?: number
          product_id?: number | null
          quantity?: number | null
        }
        Update: {
          cart_id?: number | null
          id?: number
          product_id?: number | null
          quantity?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "cart_item_cart_id_fkey"
            columns: ["cart_id"]
            isOneToOne: false
            referencedRelation: "cart"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_item_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product"
            referencedColumns: ["product_id"]
          },
        ]
      }
      category: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id: number
          name: string
        }
        Update: {
          id?: number
          name?: string
        }
        Relationships: []
      }
      email_verification: {
        Row: {
          contactno: string | null
          dob: string | null
          expiry_time: string | null
          gender: string | null
          gmail: string | null
          id: number
          image_url: string | null
          name: string | null
          otp: number | null
          password: string | null
          verified: boolean | null
        }
        Insert: {
          contactno?: string | null
          dob?: string | null
          expiry_time?: string | null
          gender?: string | null
          gmail?: string | null
          id?: number
          image_url?: string | null
          name?: string | null
          otp?: number | null
          password?: string | null
          verified?: boolean | null
        }
        Update: {
          contactno?: string | null
          dob?: string | null
          expiry_time?: string | null
          gender?: string | null
          gmail?: string | null
          id?: number
          image_url?: string | null
          name?: string | null
          otp?: number | null
          password?: string | null
          verified?: boolean | null
        }
        Relationships: []
      }
      order_item: {
        Row: {
          discount_percent: number | null
          id: number
          order_id: number | null
          pname: string | null
          price: number | null
          product_id: number | null
          quantity: number | null
        }
        Insert: {
          discount_percent?: number | null
          id?: number
          order_id?: number | null
          pname?: string | null
          price?: number | null
          product_id?: number | null
          quantity?: number | null
        }
        Update: {
          discount_percent?: number | null
          id?: number
          order_id?: number | null
          pname?: string | null
          price?: number | null
          product_id?: number | null
          quantity?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "order_item_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          address_id: number | null
          created_at: string | null
          gmail: string | null
          id: number
          razorpay_order_id: string | null
          razorpay_payment_id: string | null
          status: string | null
          total_amount: number | null
        }
        Insert: {
          address_id?: number | null
          created_at?: string | null
          gmail?: string | null
          id?: number
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          status?: string | null
          total_amount?: number | null
        }
        Update: {
          address_id?: number | null
          created_at?: string | null
          gmail?: string | null
          id?: number
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          status?: string | null
          total_amount?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_gmail_fkey"
            columns: ["gmail"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["gmail"]
          },
        ]
      }
      product: {
        Row: {
          category: string | null
          color: string | null
          features: string | null
          height: string | null
          is_available: number | null
          length: string | null
          material: string | null
          original_price: number | null
          pack_size: string | null
          pname: string | null
          price: number | null
          product_id: number
          product_images: string | null
          product_usage: string | null
          quantity: number | null
          size: string | null
          sub_category: string | null
          sustainability_tag: string | null
          uv_protection: number | null
          weight: string | null
          width: string | null
        }
        Insert: {
          category?: string | null
          color?: string | null
          features?: string | null
          height?: string | null
          is_available?: number | null
          length?: string | null
          material?: string | null
          original_price?: number | null
          pack_size?: string | null
          pname?: string | null
          price?: number | null
          product_id: number
          product_images?: string | null
          product_usage?: string | null
          quantity?: number | null
          size?: string | null
          sub_category?: string | null
          sustainability_tag?: string | null
          uv_protection?: number | null
          weight?: string | null
          width?: string | null
        }
        Update: {
          category?: string | null
          color?: string | null
          features?: string | null
          height?: string | null
          is_available?: number | null
          length?: string | null
          material?: string | null
          original_price?: number | null
          pack_size?: string | null
          pname?: string | null
          price?: number | null
          product_id?: number
          product_images?: string | null
          product_usage?: string | null
          quantity?: number | null
          size?: string | null
          sub_category?: string | null
          sustainability_tag?: string | null
          uv_protection?: number | null
          weight?: string | null
          width?: string | null
        }
        Relationships: []
      }
      product_discount_tier: {
        Row: {
          discount_percent: number
          id: number
          min_quantity: number
          product_id: number | null
        }
        Insert: {
          discount_percent: number
          id?: number
          min_quantity: number
          product_id?: number | null
        }
        Update: {
          discount_percent?: number
          id?: number
          min_quantity?: number
          product_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "product_discount_tier_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product"
            referencedColumns: ["product_id"]
          },
        ]
      }
      product_image: {
        Row: {
          id: number
          image_url: string | null
          product_id: number | null
        }
        Insert: {
          id?: number
          image_url?: string | null
          product_id?: number | null
        }
        Update: {
          id?: number
          image_url?: string | null
          product_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "product_image_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product"
            referencedColumns: ["product_id"]
          },
        ]
      }
      users: {
        Row: {
          contactno: string | null
          dob: string | null
          enabled: boolean | null
          gender: string | null
          gmail: string
          image_url: string | null
          name: string | null
          password: string
          role: string | null
        }
        Insert: {
          contactno?: string | null
          dob?: string | null
          enabled?: boolean | null
          gender?: string | null
          gmail: string
          image_url?: string | null
          name?: string | null
          password: string
          role?: string | null
        }
        Update: {
          contactno?: string | null
          dob?: string | null
          enabled?: boolean | null
          gender?: string | null
          gmail?: string
          image_url?: string | null
          name?: string | null
          password?: string
          role?: string | null
        }
        Relationships: []
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
    Enums: {},
  },
} as const
