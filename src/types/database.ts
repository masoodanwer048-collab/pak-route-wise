export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[];

export type UserRole = 'admin' | 'operations_manager' | 'compliance_officer' | 'finance' | 'customer' | 'driver';
export type ShipmentStatus = 'pending' | 'approved' | 'in_transit' | 'customs_hold' | 'cleared' | 'delivered' | 'cancelled';

export interface Database {
    public: {
        Tables: {
            customers: {
                Row: {
                    id: string;
                    name: string;
                    contact_person: string | null;
                    email: string | null;
                    phone: string | null;
                    address: string | null;
                    tax_id: string | null;
                    credit_limit: number | null;
                    payment_terms: string | null;
                    is_active: boolean;
                    created_at: string;
                };
                Insert: Omit<Database['public']['Tables']['customers']['Row'], 'id' | 'created_at'>;
                Update: Partial<Database['public']['Tables']['customers']['Insert']>;
            };
            vehicles: {
                Row: {
                    id: string;
                    registration_number: string;
                    type: string | null;
                    capacity_weight: number | null;
                    capacity_volume: number | null;
                    status: string;
                    fitness_expiry: string | null;
                    insurance_expiry: string | null;
                    created_at: string;
                };
                Insert: Omit<Database['public']['Tables']['vehicles']['Row'], 'id' | 'created_at'>;
                Update: Partial<Database['public']['Tables']['vehicles']['Insert']>;
            };
            drivers: {
                Row: {
                    id: string;
                    full_name: string;
                    license_number: string;
                    license_expiry: string | null;
                    phone: string | null;
                    status: string;
                    created_at: string;
                };
                Insert: Omit<Database['public']['Tables']['drivers']['Row'], 'id' | 'created_at'>;
                Update: Partial<Database['public']['Tables']['drivers']['Insert']>;
            };
            shipments: {
                Row: {
                    id: string;
                    shipment_id: string;
                    customer_id: string | null;
                    contract_id: string | null;
                    origin: string;
                    destination: string;
                    route_id: string | null;
                    commodity: string | null;
                    hs_code: string | null;
                    weight: number | null;
                    packages: number | null;
                    container_number: string | null;
                    vehicle_id: string | null;
                    driver_id: string | null;
                    eta: string | null;
                    etd: string | null;
                    pld: string | null;
                    incoterms: string | null;
                    insurance_policy: string | null;
                    status: ShipmentStatus;
                    created_by: string | null;
                    created_at: string;
                    updated_at: string;
                };
                Insert: Omit<Database['public']['Tables']['shipments']['Row'], 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Database['public']['Tables']['shipments']['Insert']>;
            };
        };
    };
}
