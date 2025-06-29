-- Create database tables for Maroc Transit logistics platform

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    user_type VARCHAR(50) DEFAULT 'individual', -- individual, company, carrier, admin
    phone_number VARCHAR(20),
    city VARCHAR(100),
    country VARCHAR(100) DEFAULT 'Morocco',
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Companies table
CREATE TABLE IF NOT EXISTS companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    company_name VARCHAR(255) NOT NULL,
    registration_number VARCHAR(100),
    tax_id VARCHAR(100),
    address TEXT,
    city VARCHAR(100),
    country VARCHAR(100) DEFAULT 'Morocco',
    phone VARCHAR(20),
    email VARCHAR(255),
    website VARCHAR(255),
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Locations table
CREATE TABLE IF NOT EXISTS locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    address TEXT,
    city VARCHAR(100) NOT NULL,
    state_province VARCHAR(100),
    country VARCHAR(100) DEFAULT 'Morocco',
    postal_code VARCHAR(20),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    location_type VARCHAR(50) DEFAULT 'city', -- city, warehouse, port, border
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Trucks table
CREATE TABLE IF NOT EXISTS trucks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
    license_plate VARCHAR(20) UNIQUE NOT NULL,
    truck_type VARCHAR(100) NOT NULL, -- flatbed, refrigerated, container, etc.
    brand VARCHAR(100),
    model VARCHAR(100),
    year INTEGER,
    capacity_kg INTEGER,
    capacity_m3 DECIMAL(8, 2),
    fuel_type VARCHAR(50) DEFAULT 'diesel',
    status VARCHAR(50) DEFAULT 'available', -- available, in_transit, maintenance, inactive
    current_location_id UUID REFERENCES locations(id),
    insurance_expiry DATE,
    registration_expiry DATE,
    last_maintenance DATE,
    next_maintenance DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Drivers table
CREATE TABLE IF NOT EXISTS drivers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    license_number VARCHAR(50) UNIQUE NOT NULL,
    license_type VARCHAR(50) NOT NULL,
    license_expiry DATE NOT NULL,
    experience_years INTEGER DEFAULT 0,
    rating DECIMAL(3, 2) DEFAULT 0.00,
    total_trips INTEGER DEFAULT 0,
    status VARCHAR(50) DEFAULT 'available', -- available, driving, off_duty, inactive
    current_truck_id UUID REFERENCES trucks(id),
    emergency_contact_name VARCHAR(255),
    emergency_contact_phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Routes table
CREATE TABLE IF NOT EXISTS routes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    origin_id UUID REFERENCES locations(id) NOT NULL,
    destination_id UUID REFERENCES locations(id) NOT NULL,
    distance_km DECIMAL(8, 2),
    estimated_duration_hours DECIMAL(5, 2),
    toll_cost DECIMAL(10, 2) DEFAULT 0,
    fuel_cost_estimate DECIMAL(10, 2) DEFAULT 0,
    difficulty_level VARCHAR(20) DEFAULT 'medium', -- easy, medium, hard
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Shipments table
CREATE TABLE IF NOT EXISTS shipments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    shipper_id UUID REFERENCES users(id) NOT NULL,
    carrier_id UUID REFERENCES users(id),
    truck_id UUID REFERENCES trucks(id),
    driver_id UUID REFERENCES drivers(id),
    route_id UUID REFERENCES routes(id),
    origin_id UUID REFERENCES locations(id) NOT NULL,
    destination_id UUID REFERENCES locations(id) NOT NULL,
    pickup_date DATE NOT NULL,
    delivery_date DATE,
    cargo_type VARCHAR(100) NOT NULL,
    cargo_description TEXT,
    weight_kg DECIMAL(10, 2),
    volume_m3 DECIMAL(8, 2),
    value_mad DECIMAL(12, 2),
    special_requirements TEXT,
    status VARCHAR(50) DEFAULT 'pending', -- pending, assigned, picked_up, in_transit, delivered, cancelled
    price_mad DECIMAL(10, 2),
    payment_status VARCHAR(50) DEFAULT 'pending', -- pending, paid, overdue
    tracking_number VARCHAR(50) UNIQUE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Shipment tracking table
CREATE TABLE IF NOT EXISTS shipment_tracking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    shipment_id UUID REFERENCES shipments(id) ON DELETE CASCADE,
    location_id UUID REFERENCES locations(id),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    status VARCHAR(100) NOT NULL,
    notes TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id)
);

-- Maintenance records table
CREATE TABLE IF NOT EXISTS maintenance_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    truck_id UUID REFERENCES trucks(id) ON DELETE CASCADE,
    maintenance_type VARCHAR(100) NOT NULL, -- routine, repair, inspection
    description TEXT NOT NULL,
    cost_mad DECIMAL(10, 2),
    service_provider VARCHAR(255),
    scheduled_date DATE,
    completed_date DATE,
    status VARCHAR(50) DEFAULT 'scheduled', -- scheduled, in_progress, completed, cancelled
    next_service_km INTEGER,
    notes TEXT,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id UUID REFERENCES users(id) NOT NULL,
    recipient_id UUID REFERENCES users(id) NOT NULL,
    shipment_id UUID REFERENCES shipments(id),
    subject VARCHAR(255),
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    message_type VARCHAR(50) DEFAULT 'general', -- general, shipment, system, support
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'info', -- info, warning, error, success
    is_read BOOLEAN DEFAULT FALSE,
    action_url VARCHAR(500),
    related_id UUID, -- Can reference any related entity
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Invoices table
CREATE TABLE IF NOT EXISTS invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    shipment_id UUID REFERENCES shipments(id) NOT NULL,
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    issuer_id UUID REFERENCES users(id) NOT NULL,
    recipient_id UUID REFERENCES users(id) NOT NULL,
    amount_mad DECIMAL(12, 2) NOT NULL,
    tax_amount_mad DECIMAL(12, 2) DEFAULT 0,
    total_amount_mad DECIMAL(12, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'MAD',
    status VARCHAR(50) DEFAULT 'pending', -- pending, sent, paid, overdue, cancelled
    issue_date DATE DEFAULT CURRENT_DATE,
    due_date DATE,
    paid_date DATE,
    payment_method VARCHAR(50),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_user_type ON users(user_type);
CREATE INDEX IF NOT EXISTS idx_trucks_owner_id ON trucks(owner_id);
CREATE INDEX IF NOT EXISTS idx_trucks_status ON trucks(status);
CREATE INDEX IF NOT EXISTS idx_drivers_user_id ON drivers(user_id);
CREATE INDEX IF NOT EXISTS idx_drivers_status ON drivers(status);
CREATE INDEX IF NOT EXISTS idx_shipments_shipper_id ON shipments(shipper_id);
CREATE INDEX IF NOT EXISTS idx_shipments_carrier_id ON shipments(carrier_id);
CREATE INDEX IF NOT EXISTS idx_shipments_status ON shipments(status);
CREATE INDEX IF NOT EXISTS idx_shipments_tracking_number ON shipments(tracking_number);
CREATE INDEX IF NOT EXISTS idx_shipment_tracking_shipment_id ON shipment_tracking(shipment_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_truck_id ON maintenance_records(truck_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_recipient_id ON messages(recipient_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_invoices_shipment_id ON invoices(shipment_id);
