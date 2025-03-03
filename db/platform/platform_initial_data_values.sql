-- Insert roles into platform_user_roles
INSERT INTO public.platform_user_roles (id, name)
VALUES 
  (1, 'Vendedor'),
  (2, 'Supervisor de ventas'),
  (3, 'Administrador'),
  (4, 'Gerente'),
  (5, 'Proveedor'),
  (6, 'root'),
  (7, 'Administrador (Empresas)');

-- Insert user into platform_states
INSERT INTO public.platform_states (id, name, created_at) 
VALUES 
(1, 'Sin iniciar', NOW()),
(2, 'Pendiente', NOW()),
(3, 'Pagado', NOW()),
(4, 'Finalizado', NOW());

-- Insert user into platform_user_businesses
INSERT INTO public.platform_user_businesses (
  id,name, enabled_plugins) VALUES 
  (1,'Sistema Inari', '[1,2]');

INSERT INTO public.platform_plugins (
  id,name, description) VALUES 
  (1, 'Control de Stock','Plugin para gestionar el control de stock'),
  (2, 'Ventas (local)', 'Plugin para la gestión de ventas locales');

-- Insert user into platform_states
INSERT INTO public.currency_types (id, abbreviation, name, created_at) 
VALUES 
(1, 'No aplica', 'No aplica', NOW()),              -- Sin especificar
(2, 'ARS', 'Pesos Argentinos', NOW()),             -- Argentina
(3, 'BRL', 'Reales Brasileños', NOW()),            -- Brasil
(4, 'CRC', 'Colones Costarricenses', NOW()),       -- Costa Rica
(5, 'COP', 'Pesos Colombianos', NOW()),            -- Colombia
(6, 'EUR', 'Euro', NOW()),                         -- Euro
(7, 'GBP', 'Libra Esterlina', NOW()),              -- Libra Esterlina
(8, 'HNL', 'Lempiras Hondureños', NOW()),          -- Honduras
(9, 'MXN', 'Pesos Mexicanos', NOW()),              -- México
(10, 'PEN', 'Soles Peruanos', NOW()),              -- Perú
(11, 'CLP', 'Pesos Chilenos', NOW()),              -- Chile
(12, 'USD', 'Dólar Estadounidense', NOW()),        -- Estados Unidos
(13, 'UYU', 'Pesos Uruguayos', NOW());             -- Uruguay

-- Insert data into countries table
INSERT INTO public.countries (id, abbreviation, name, created_at) VALUES
(1, 'ARG', 'Argentina', NOW()),
(2, 'BRA', 'Brazil', NOW()),
(3, 'CRI', 'Costa Rica', NOW()),
(4, 'COL', 'Colombia', NOW()),
(5, 'EUR', 'European Union', NOW()),
(6, 'GBR', 'United Kingdom', NOW()),
(7, 'HND', 'Honduras', NOW()),
(8, 'MEX', 'Mexico', NOW()),
(9, 'PER', 'Peru', NOW()),
(10, 'CHL', 'Chile', NOW()),
(11, 'USA', 'United States', NOW()),
(12, 'URY', 'Uruguay', NOW());

-- Insert data into platform_user_genders table
INSERT INTO public.platform_user_genders (id, abbreviation, name, created_at) VALUES
(1, 'M', 'Masculino', NOW()),
(2, 'F', 'Femenino', NOW()),
(3, 'NB', 'No binario', NOW()),
(4, 'NA', 'Prefiero no responder', NOW());

-- Insert data into payment_methods table
INSERT INTO public.payment_methods (name)
VALUES ('Mercado Pago');

-- Insert data into stock_product_measure_units table
INSERT INTO stock_product_measure_units (name, description) VALUES
('Metro', 'Unidad de medida utilizada para productos vendidos por longitud.'),
('Caja', 'Unidad de medida utilizada para productos vendidos en cajas.'),
('Unidad', 'Unidad de medida utilizada para productos vendidos individualmente.'),
('Litro', 'Unidad de medida utilizada para productos vendidos por volumen.'),
('Kilogramo', 'Unidad de medida utilizada para productos vendidos por peso.');


-- Insert user into platform_users
INSERT INTO public.platform_users (
  id, first_name, last_name, phone, email, username, password, is_root, user_role_id, is_active, token, dni_ssn, country_id, platform_user_gender_id, birthdate,created_by_user_id
)
VALUES 
  (1, 'Ezequiel', 'Tartaglia', '2216794817', 'ezequielmtartaglia@gmail.com', 'Ezequiel M. Tartaglia', '123123123', true, 6, false, null, '12312312', 1, 1,'1994-08-18',1);

  -- Insert user into platform_settings
INSERT INTO public.platform_settings (
  contact_number, developer_name, developer_contact_email
)
VALUES 
  ('', 'Ezequiel M. Tartaglia', 'ezequielmtartaglia@gmail.com');
