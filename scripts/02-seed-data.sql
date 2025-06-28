-- Seed data for Maroc Transit logistics platform

-- Insert sample locations (major Moroccan cities)
INSERT INTO locations (name, city, country, latitude, longitude, location_type) VALUES
('Casablanca Port', 'Casablanca', 'Morocco', 33.5731, -7.5898, 'port'),
('Rabat Center', 'Rabat', 'Morocco', 34.0209, -6.8416, 'city'),
('Marrakech Hub', 'Marrakech', 'Morocco', 31.6295, -7.9811, 'city'),
('Fez Industrial Zone', 'Fez', 'Morocco', 34.0181, -5.0078, 'warehouse'),
('Tangier Port', 'Tangier', 'Morocco', 35.7595, -5.8340, 'port'),
('Agadir Commercial', 'Agadir', 'Morocco', 30.4278, -9.5981, 'city'),
('Meknes Distribution', 'Meknes', 'Morocco', 33.8935, -5.5473, 'warehouse'),
('Oujda Border', 'Oujda', 'Morocco', 34.6814, -1.9086, 'border'),
('Laayoune Regional', 'Laayoune', 'Morocco', 27.1253, -13.1625, 'city'),
('Tetouan Logistics', 'Tetouan', 'Morocco', 35.5889, -5.3626, 'warehouse');

-- Insert sample admin user
INSERT INTO users (name, email, password_hash, role, user_type, city, country, is_verified, is_active) VALUES
('Admin User', 'admin@maroctransit.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qm', 'admin', 'admin', 'Casablanca', 'Morocco', TRUE, TRUE);

-- Insert sample carriers
INSERT INTO users (name, email, password_hash, role, user_type, phone_number, city, country, is_verified, is_active) VALUES
('Transport Atlas', 'contact@transportatlas.ma', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qm', 'carrier', 'company', '+212661234567', 'Casablanca', 'Morocco', TRUE, TRUE),
('Logistique Maghreb', 'info@logistiquemaghreb.ma', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qm', 'carrier', 'company', '+212662345678', 'Rabat', 'Morocco', TRUE, TRUE),
('Rif Transport', 'contact@riftransport.ma', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qm', 'carrier', 'company', '+212663456789', 'Tangier', 'Morocco', TRUE, TRUE);

-- Insert sample individual users
INSERT INTO users (name, email, password_hash, role, user_type, phone_number, city, country, is_verified, is_active) VALUES
('Ahmed Benali', 'ahmed.benali@email.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qm', 'user', 'individual', '+212664567890', 'Marrakech', 'Morocco', TRUE, TRUE),
('Fatima Zahra', 'fatima.zahra@email.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qm', 'user', 'individual', '+212665678901', 'Fez', 'Morocco', TRUE, TRUE),
('Omar Alami', 'omar.alami@email.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qm', 'user', 'individual', '+212666789012', 'Agadir', 'Morocco', TRUE, TRUE);

-- Insert sample companies
INSERT INTO companies (user_id, company_name, registration_number, address, city, country, phone, email, is_verified) VALUES
((SELECT id FROM users WHERE email = 'contact@transportatlas.ma'), 'Transport Atlas SARL', 'RC123456', '123 Boulevard Mohammed V', 'Casablanca', 'Morocco', '+212522123456', 'contact@transportatlas.ma', TRUE),
((SELECT id FROM users WHERE email = 'info@logistiquemaghreb.ma'), 'Logistique Maghreb SA', 'RC234567', '456 Avenue Hassan II', 'Rabat', 'Morocco', '+212537234567', 'info@logistiquemaghreb.ma', TRUE),
((SELECT id FROM users WHERE email = 'contact@riftransport.ma'), 'Rif Transport SARL', 'RC345678', '789 Rue Ibn Battuta', 'Tangier', 'Morocco', '+212539345678', 'contact@riftransport.ma', TRUE);

-- Insert sample trucks
INSERT INTO trucks (owner_id, license_plate, truck_type, brand, model, year, capacity_kg, capacity_m3, status, current_location_id, insurance_expiry, registration_expiry) VALUES
((SELECT id FROM users WHERE email = 'contact@transportatlas.ma'), 'A-123-45', 'Container Truck', 'Mercedes', 'Actros', 2020, 25000, 80.0, 'available', (SELECT id FROM locations WHERE name = 'Casablanca Port'), '2024-12-31', '2024-06-30'),
((SELECT id FROM users WHERE email = 'contact@transportatlas.ma'), 'A-234-56', 'Flatbed', 'Volvo', 'FH16', 2019, 20000, 60.0, 'available', (SELECT id FROM locations WHERE name = 'Casablanca Port'), '2024-11-30', '2024-05-31'),
((SELECT id FROM users WHERE email = 'info@logistiquemaghreb.ma'), 'B-345-67', 'Refrigerated', 'Scania', 'R450', 2021, 18000, 50.0, 'available', (SELECT id FROM locations WHERE name = 'Rabat Center'), '2025-01-31', '2024-07-31'),
((SELECT id FROM users WHERE email = 'contact@riftransport.ma'), 'C-456-78', 'Container Truck', 'DAF', 'XF', 2018, 22000, 70.0, 'available', (SELECT id FROM locations WHERE name = 'Tangier Port'), '2024-10-31', '2024-04-30');

-- Insert sample drivers
INSERT INTO drivers (user_id, license_number, license_type, license_expiry, experience_years, rating, total_trips, status) VALUES
((SELECT id FROM users WHERE email = 'contact@transportatlas.ma'), 'DL123456789', 'Heavy Vehicle', '2025-06-30', 8, 4.5, 150, 'available'),
((SELECT id FROM users WHERE email = 'info@logistiquemaghreb.ma'), 'DL234567890', 'Heavy Vehicle', '2025-08-31', 12, 4.8, 200, 'available'),
((SELECT id FROM users WHERE email = 'contact@riftransport.ma'), 'DL345678901', 'Heavy Vehicle', '2025-04-30', 6, 4.2, 120, 'available');

-- Insert sample routes
INSERT INTO routes (name, origin_id, destination_id, distance_km, estimated_duration_hours, toll_cost, fuel_cost_estimate) VALUES
('Casablanca - Rabat Express', 
 (SELECT id FROM locations WHERE name = 'Casablanca Port'), 
 (SELECT id FROM locations WHERE name = 'Rabat Center'), 
 90, 1.5, 25.00, 150.00),
('Rabat - Fez Commercial', 
 (SELECT id FROM locations WHERE name = 'Rabat Center'), 
 (SELECT id FROM locations WHERE name = 'Fez Industrial Zone'), 
 200, 3.0, 50.00, 300.00),
('Tangier - Casablanca Highway', 
 (SELECT id FROM locations WHERE name = 'Tangier Port'), 
 (SELECT id FROM locations WHERE name = 'Casablanca Port'), 
 350, 4.5, 80.00, 500.00),
('Marrakech - Agadir Coastal', 
 (SELECT id FROM locations WHERE name = 'Marrakech Hub'), 
 (SELECT id FROM locations WHERE name = 'Agadir Commercial'), 
 250, 3.5, 60.00, 400.00);

-- Insert sample shipments
INSERT INTO shipments (shipper_id, origin_id, destination_id, pickup_date, cargo_type, cargo_description, weight_kg, volume_m3, value_mad, status, price_mad, tracking_number) VALUES
((SELECT id FROM users WHERE email = 'ahmed.benali@email.com'),
 (SELECT id FROM locations WHERE name = 'Marrakech Hub'),
 (SELECT id FROM locations WHERE name = 'Casablanca Port'),
 CURRENT_DATE + INTERVAL '2 days',
 'Electronics',
 'Computer equipment and accessories',
 500.00, 2.5, 50000.00, 'pending', 1200.00, 'MT2024001'),
((SELECT id FROM users WHERE email = 'fatima.zahra@email.com'),
 (SELECT id FROM locations WHERE name = 'Fez Industrial Zone'),
 (SELECT id FROM locations WHERE name = 'Tangier Port'),
 CURRENT_DATE + INTERVAL '3 days',
 'Textiles',
 'Traditional Moroccan carpets and fabrics',
 800.00, 4.0, 30000.00, 'pending', 1500.00, 'MT2024002'),
((SELECT id FROM users WHERE email = 'omar.alami@email.com'),
 (SELECT id FROM locations WHERE name = 'Agadir Commercial'),
 (SELECT id FROM locations WHERE name = 'Rabat Center'),
 CURRENT_DATE + INTERVAL '1 day',
 'Food Products',
 'Fresh agricultural produce',
 1200.00, 6.0, 15000.00, 'pending', 800.00, 'MT2024003');

-- Insert sample notifications
INSERT INTO notifications (user_id, title, message, type) VALUES
((SELECT id FROM users WHERE email = 'ahmed.benali@email.com'), 'Shipment Created', 'Your shipment MT2024001 has been created successfully', 'success'),
((SELECT id FROM users WHERE email = 'fatima.zahra@email.com'), 'Shipment Created', 'Your shipment MT2024002 has been created successfully', 'success'),
((SELECT id FROM users WHERE email = 'omar.alami@email.com'), 'Shipment Created', 'Your shipment MT2024003 has been created successfully', 'success'),
((SELECT id FROM users WHERE email = 'contact@transportatlas.ma'), 'New Shipment Available', 'A new shipment matching your criteria is available', 'info'),
((SELECT id FROM users WHERE email = 'admin@maroctransit.com'), 'System Status', 'All systems are operational', 'info');
