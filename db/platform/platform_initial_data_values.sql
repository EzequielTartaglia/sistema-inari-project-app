-- Insert roles into platform_user_roles
INSERT INTO public.platform_user_roles (id, name, created_at)
VALUES 
  (1, 'Vendedor', NOW()),
  (2, 'Supervisor de ventas', NOW()),
  (3, 'Administrador', NOW()),
  (4, 'Gerente', NOW()),
  (5, 'Proveedor', NOW()),
  (6, 'root', NOW());

-- Insert user into platform_states
INSERT INTO public.platform_states (id, name, created_at) 
VALUES 
(1, 'Sin iniciar', NOW()),
(2, 'Pendiente', NOW()),
(3, 'Pagado', NOW()),
(4, 'Finalizado', NOW());

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

-- Insert user into platform_users
INSERT INTO public.platform_users (
  first_name, last_name, phone, email, username, password, is_root, user_role_id, created_at, is_active, token, dni_ssn, country_id, platform_user_gender_id
)
VALUES 
  ('Ezequiel', 'Tartaglia', '2216794817', 'ezequielmtartaglia@gmail.com', 'Ezequiel M. Tartaglia', '123123123', true, 6, NOW(), false, null, '12312312', 1, 1);