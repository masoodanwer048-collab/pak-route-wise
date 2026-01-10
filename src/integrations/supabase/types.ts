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
          manifest_number: string
          manifest_type: "LINEHAUL" | "DELIVERY" | "RTO" | "VENDOR" | "CONTAINER" | null
          status: "DRAFT" | "LOADING" | "READY_FOR_HANDOVER" | "HANDED_OVER" | "IN_TRANSIT" | "RECEIVED" | "CLOSED" | "CANCELLED" | "REOPENED" | "SUBMITTED" | null
          origin_hub: string
          destination_hub: string
          route_name: string | null
          route_code: string | null
          dispatch_date_time: string | null
          expected_arrival_date_time: string | null
          actual_arrival_date_time: string | null
          created_by: string | null
          created_at: string
          updated_at: string | null
          approved_by: string | null
          approved_at: string | null
          reopen_reason: string | null
          reopen_approved_by: string | null
          cancel_reason: string | null
          cancelled_by: string | null

          // Carrier
          carrier_type: "OWN_FLEET" | "VENDOR" | "BUS_CARGO" | "AIR" | "3PL" | "SHIPPING_LINE"
          carrier_name: string
          carrier_id: string | null
          carrier_phone: string | null
          carrier_address: string | null

          // Driver
          driver_name: string
          driver_cnic: string
          driver_mobile: string | null
          driver_license_no: string | null
          driver_license_expiry: string | null
          driver_address: string | null
          driver_emergency_contact: string | null
          helper_name: string | null
          helper_cnic: string | null
          helper_mobile: string | null
          driver_signature_url: string | null
          driver_otp_verified: boolean | null

          // Vehicle
          vehicle_reg_no: string
          vehicle_type: string | null
          vehicle_make: string | null
          vehicle_model: string | null
          vehicle_year: string | null
          vehicle_color: string | null
          engine_no: string | null
          chassis_no: string | null
          fitness_cert_no: string | null
          fitness_expiry: string | null
          vehicle_insurance_company: string | null
          vehicle_insurance_expiry: string | null
          tracker_id: string | null
          odometer_start: number | null
          odometer_end: number | null
          fuel_level_start: number | null
          fuel_level_end: number | null
          vehicle_capacity_weight: number | null
          vehicle_capacity_volume: number | null

          // Customs / Shipping
          gd_number: string | null
          gd_date: string | null
          igm_number: string | null
          ngm_number: string | null
          index_number: string | null
          bl_number: string | null
          shipping_bill_number: string | null
          container_no: string | null
          container_size: "20FT" | "40FT" | "40HQ" | "LCL" | null
          container_type: "DRY" | "REEFER" | "OPEN_TOP" | "FLAT_RACK" | null
          seal_no: string | null
          pkg_count: number | null
          pkg_type: string | null
          pkg_marks: string | null
          gross_weight: number | null
          net_weight: number | null
          volume_cbm: number | null
          hs_code: string | null
          commodity_description: string | null
          port_of_loading: string | null
          port_of_discharge: string | null
          final_destination: string | null
          vessel_name: string | null
          voyage_number: string | null
          shipping_line_name: string | null
          freight_terms: string | null
          insurance_details: string | null
          customs_station_code: string | null
          clearing_agent_name: string | null
          clearing_agent_phone: string | null
          clearing_agent_ntn: string | null
          consignee_name: string | null
          consignee_phone: string | null
          consignee_address: string | null
          shipper_name: string | null
          shipper_phone: string | null
          notify_party: string | null
          remarks: string | null

          // Trip & Ops
          trip_id: string | null
          departure_gate: string | null
          dispatch_shift: string | null
          loading_start_time: string | null
          loading_end_time: string | null
          handover_time: string | null
          transit_start_time: string | null
          transit_stop_time: string | null
          receiving_start_time: string | null
          receiving_end_time: string | null

          // Security
          security_check_status: "PASSED" | "FAILED" | "PENDING" | null
          security_guard_name: string | null
          cctv_reference_id: string | null
          seal_verification_status: string | null
          seal_broken_reason: string | null
          high_value_approval_id: string | null
          police_escort_required: boolean | null

          // Financial
          carrier_cost: number | null
          fuel_cost: number | null
          toll_charges: number | null
          loading_charges: number | null
          other_charges: number | null

          // Tracking
          qr_code: string | null
          proof_of_handover_url: string | null
          proof_of_receiving_url: string | null

          [key: string]: any
        }
        Insert: {
          id?: string
          manifest_number: string
          manifest_type?: "LINEHAUL" | "DELIVERY" | "RTO" | "VENDOR" | "CONTAINER" | null
          status?: "DRAFT" | "LOADING" | "READY_FOR_HANDOVER" | "HANDED_OVER" | "IN_TRANSIT" | "RECEIVED" | "CLOSED" | "CANCELLED" | "REOPENED" | null
          origin_hub: string
          destination_hub: string
          route_name?: string | null
          route_code?: string | null
          dispatch_date_time?: string | null
          expected_arrival_date_time?: string | null
          actual_arrival_date_time?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string | null
          approved_by?: string | null
          approved_at?: string | null
          reopen_reason?: string | null
          reopen_approved_by?: string | null
          cancel_reason?: string | null
          cancelled_by?: string | null

          carrier_type?: "OWN_FLEET" | "VENDOR" | "BUS_CARGO" | "AIR" | "3PL" | "SHIPPING_LINE"
          carrier_name: string
          carrier_id?: string | null
          carrier_phone?: string | null
          carrier_address?: string | null

          driver_name: string
          driver_cnic: string
          driver_mobile?: string | null
          driver_license_no?: string | null
          driver_license_expiry?: string | null
          driver_address?: string | null
          driver_emergency_contact?: string | null
          helper_name?: string | null
          helper_cnic?: string | null
          helper_mobile?: string | null
          driver_signature_url?: string | null
          driver_otp_verified?: boolean | null

          vehicle_reg_no: string
          vehicle_type?: string | null
          vehicle_make?: string | null
          vehicle_model?: string | null
          vehicle_year?: string | null
          vehicle_color?: string | null
          engine_no?: string | null
          chassis_no?: string | null
          fitness_cert_no?: string | null
          fitness_expiry?: string | null
          vehicle_insurance_company?: string | null
          vehicle_insurance_expiry?: string | null
          tracker_id?: string | null
          odometer_start?: number | null
          odometer_end?: number | null
          fuel_level_start?: number | null
          fuel_level_end?: number | null
          vehicle_capacity_weight?: number | null
          vehicle_capacity_volume?: number | null

          gd_number?: string | null
          gd_date?: string | null
          igm_number?: string | null
          ngm_number?: string | null
          index_number?: string | null
          bl_number?: string | null
          shipping_bill_number?: string | null
          container_no?: string | null
          container_size?: "20FT" | "40FT" | "40HQ" | "LCL" | null
          container_type?: "DRY" | "REEFER" | "OPEN_TOP" | "FLAT_RACK" | null
          seal_no?: string | null
          pkg_count?: number | null
          pkg_type?: string | null
          pkg_marks?: string | null
          gross_weight?: number | null
          net_weight?: number | null
          volume_cbm?: number | null
          hs_code?: string | null
          commodity_description?: string | null
          port_of_loading?: string | null
          port_of_discharge?: string | null
          final_destination?: string | null
          vessel_name?: string | null
          voyage_number?: string | null
          shipping_line_name?: string | null
          freight_terms?: string | null
          insurance_details?: string | null
          customs_station_code?: string | null
          clearing_agent_name?: string | null
          clearing_agent_phone?: string | null
          clearing_agent_ntn?: string | null
          consignee_name?: string | null
          consignee_phone?: string | null
          consignee_address?: string | null
          shipper_name?: string | null
          shipper_phone?: string | null
          notify_party?: string | null
          remarks?: string | null

          trip_id?: string | null
          departure_gate?: string | null
          dispatch_shift?: string | null
          loading_start_time?: string | null
          loading_end_time?: string | null
          handover_time?: string | null
          transit_start_time?: string | null
          transit_stop_time?: string | null
          receiving_start_time?: string | null
          receiving_end_time?: string | null

          security_check_status?: "PASSED" | "FAILED" | "PENDING" | null
          security_guard_name?: string | null
          cctv_reference_id?: string | null
          seal_verification_status?: string | null
          seal_broken_reason?: string | null
          high_value_approval_id?: string | null
          police_escort_required?: boolean | null

          carrier_cost?: number | null
          fuel_cost?: number | null
          toll_charges?: number | null
          loading_charges?: number | null
          other_charges?: number | null

          qr_code?: string | null
          proof_of_handover_url?: string | null
          proof_of_receiving_url?: string | null

          [key: string]: any
        }
        Update: {
          id?: string
          manifest_number?: string
          status?: "DRAFT" | "LOADING" | "READY_FOR_HANDOVER" | "HANDED_OVER" | "IN_TRANSIT" | "RECEIVED" | "CLOSED" | "CANCELLED" | "REOPENED" | null
          [key: string]: any
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
          manifest_id: string | null
          manifest_status: string | null // 'LOADED', 'RECEIVED', 'MISSING', etc.
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
