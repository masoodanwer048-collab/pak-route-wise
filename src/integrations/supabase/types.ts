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
      carrier_manifests: {
        Row: {
          id: string
          shipment_id: string | null
          carrier_user_id: string
          manifest_number: string
          vehicle_number: string
          driver_name: string
          driver_cnic: string | null
          container_numbers: string[] | null
          seal_numbers: string[] | null
          gross_weight: number | null
          departure_location: string | null
          destination_location: string | null
          departure_date: string | null
          status: "DRAFT" | "SUBMITTED" | "APPROVED"
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          shipment_id?: string | null
          carrier_user_id: string
          manifest_number: string
          vehicle_number: string
          driver_name: string
          driver_cnic?: string | null
          container_numbers?: string[] | null // JSONB in DB, but array in types usually if parsed
          seal_numbers?: string[] | null
          gross_weight?: number | null
          departure_location?: string | null
          destination_location?: string | null
          departure_date?: string | null
          status?: "DRAFT" | "SUBMITTED" | "APPROVED"
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          shipment_id?: string | null
          carrier_user_id?: string
          manifest_number?: string
          vehicle_number?: string
          driver_name?: string
          driver_cnic?: string | null
          container_numbers?: string[] | null
          seal_numbers?: string[] | null
          gross_weight?: number | null
          departure_location?: string | null
          destination_location?: string | null
          departure_date?: string | null
          status?: "DRAFT" | "SUBMITTED" | "APPROVED"
          created_at?: string
          updated_at?: string
        }
      }
      shipment_documents: {
        Row: {
          id: string
          shipment_id: string | null
          type: string
          document_number: string | null
          file_url: string | null
          status: string
          metadata: any | null // JSONB
          created_at: string
          [key: string]: any
        }
        Insert: {
          id?: string
          shipment_id?: string | null
          type: string
          document_number?: string | null
          file_url?: string | null
          status?: string
          metadata?: any | null
          [key: string]: any
        }
        Update: {
          id?: string
          [key: string]: any
        }
      }
      shipments: {
        Row: {
          id: string
          shipment_id: string
          origin: string
          destination: string
          status: string
          created_at: string
          eta: string | null
          etd: string | null
          // Add other fields as needed loosely for now
          [key: string]: any
        }
        Insert: {
          id?: string
          shipment_id: string
          origin: string
          destination: string
          status?: string
          [key: string]: any
        }
        Update: {
          id?: string
          [key: string]: any
        }
      }
      vehicles: {
        Row: {
          id: string
          registration_number: string
          type: string
          status: string
          [key: string]: any
        }
        Insert: {
          id?: string
          registration_number: string
          [key: string]: any
        }
        Update: {
          id?: string
          [key: string]: any
        }
      }
      goods_declarations: {
        Row: {
          id: string
          gd_number: string
          gd_type: "import" | "export" | "transit" | "transshipment"
          status: "draft" | "submitted" | "assessed" | "paid" | "examined" | "released"
          shipment_id: string | null
          bl_number: string | null
          importer_id: string | null
          exporter_name: string | null
          customs_station: string | null
          port_of_entry: string | null
          hs_code: string | null
          goods_description: string | null
          invoice_number: string | null
          invoice_date: string | null
          invoice_value: number | null
          currency: string | null
          exchange_rate: number | null
          assessed_value: number | null
          customs_duty: number | null
          regulatory_duty: number | null
          sales_tax: number | null
          additional_sales_tax: number | null
          withholding_tax: number | null
          federal_excise_duty: number | null
          total_duty_tax: number | null
          filing_date: string | null
          assessment_date: string | null
          payment_date: string | null
          release_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          gd_number: string
          gd_type: "import" | "export" | "transit" | "transshipment"
          status?: "draft" | "submitted" | "assessed" | "paid" | "examined" | "released"
          shipment_id?: string | null
          bl_number?: string | null
          importer_id?: string | null
          exporter_name?: string | null
          customs_station?: string | null
          port_of_entry?: string | null
          hs_code?: string | null
          goods_description?: string | null
          invoice_number?: string | null
          invoice_date?: string | null
          invoice_value?: number | null
          currency?: string | null
          exchange_rate?: number | null
          assessed_value?: number | null
          customs_duty?: number | null
          regulatory_duty?: number | null
          sales_tax?: number | null
          additional_sales_tax?: number | null
          withholding_tax?: number | null
          federal_excise_duty?: number | null
          total_duty_tax?: number | null
          filing_date?: string | null
          assessment_date?: string | null
          payment_date?: string | null
          release_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          gd_number?: string
          gd_type?: "import" | "export" | "transit" | "transshipment"
          status?: "draft" | "submitted" | "assessed" | "paid" | "examined" | "released"
          [key: string]: any
        }
      }
      imports: {
        Row: {
          id: string
          index_number: string | null
          igm_number: string | null
          bl_number: string | null
          importer_name: string | null
          status: "pending" | "igm_filed" | "gd_filed" | "assessed" | "duty_paid" | "examined" | "released" | "delivered"
          container_numbers: string[] | null
          created_at: string
          [key: string]: any
        }
        Insert: {
          id?: string
          index_number?: string | null
          status?: "pending" | "igm_filed" | "gd_filed" | "assessed" | "duty_paid" | "examined" | "released" | "delivered"
          [key: string]: any
        }
        Update: {
          id?: string
          [key: string]: any
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
