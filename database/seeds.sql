-- Sistema Web de Recetas Medicas - SEED DATA
-- Responsable: Abisag Lucero Martínez Martínez
-- Cubre: Datos iniciales para probar los roles HU-01 a HU-18, CU-01 a CU-05 y RBAC

USE system_prescriptions;

-- Desactivar temporalmente revisión de llaves foráneas para limpiar tablas sin errores
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE clinical_audit_logs;
TRUNCATE TABLE prescription_details;
TRUNCATE TABLE prescriptions;
TRUNCATE TABLE consultations;
TRUNCATE TABLE medical_appointments;
TRUNCATE TABLE medications;
TRUNCATE TABLE patients;
TRUNCATE TABLE professional_titles;
TRUNCATE TABLE doctors;
TRUNCATE TABLE users;
SET FOREIGN_KEY_CHECKS = 1;

INSERT INTO users (id_user, username, password_hash, role, failed_attempts, locked_until) VALUES
(1, 'dr.martinez', '$2b$10$X7vR8m9K2pL5nQ1wZ3yT6uO4eI9aS0dF2gH5jK8lZ1xC4vB7nM0qW', 'doctor', 0, NULL),
(2, 'sec.laura', '$2b$10$X7vR8m9K2pL5nQ1wZ3yT6uO4eI9aS0dF2gH5jK8lZ1xC4vB7nM0qW', 'secretaria', 0, NULL);

INSERT INTO doctors (id_doctor, id_user, full_name, address, office, office_phone, whatsapp, email) VALUES
(1, 1, 'Dr. Alejandro Martínez Gómez', 'Av. Universidad 1001, Fracc. Bosques del Prado, Aguascalientes, Ags.', 'Torre Médica Consultorio 304', '4499123456', '4491987654', 'dr.martinez@clinicamedica.mx');

INSERT INTO professional_titles (id_title, id_doctor, title, university, professional_license) VALUES
(1, 1, 'Médico Cirujano', 'Universidad Autónoma de Aguascalientes (UAA)', '8451236'),
(2, 1, 'Especialidad en Medicina Interna', 'Universidad Nacional Autónoma de México (UNAM)', '10948273');

INSERT INTO patients (id_patient, full_name, birthdate, contact) VALUES
(1, 'Juan Pérez López', '1984-03-15', '4491112233'),       -- Paciente Subsecuente (ya tendrá 1 receta previa)
(2, 'María Fernanda Torres Ruiz', '1999-08-22', '4494445566'), -- Paciente Nuevo (primera vez)
(3, 'Roberto Carlos Gómez Díaz', '1975-11-05', '4497778899');  -- Paciente con cita pendiente

INSERT INTO medications (id_medication, brand_name, generic_name, presentation, is_controlled) VALUES
(1, 'Tempra', 'Paracetamol', 'Tabletas 500 mg', FALSE),
(2, 'Amoxil', 'Amoxicilina', 'Cápsulas 500 mg', FALSE),
(3, 'Advil Max', 'Ibuprofeno', 'Cápsulas blandas 400 mg', FALSE),
(4, 'Losec A', 'Omeprazol', 'Cápsulas 20 mg', FALSE),
(5, 'Rivotril', 'Clonazepam', 'Tabletas 2 mg', TRUE),
(6, 'Tafil', 'Alprazolam', 'Tabletas 0.50 mg', TRUE);

-- Usamos CURDATE() para que siempre aparezcan como "Citas del día de hoy" al iniciar sesión el doctor
INSERT INTO medical_appointments (id_med_app, id_patient, date_app, hour_app, confirm_contact, status_app) VALUES
(1, 1, DATE_SUB(CURDATE(), INTERVAL 14 DAY), '10:00:00', '4491112233', 'confirmada'), -- Cita pasada de Juan Pérez
(2, 1, CURDATE(), '09:00:00', '4491112233', 'confirmada'),                            -- Cita de HOY (Paciente subsecuente)
(3, 2, CURDATE(), '10:30:00', '4494445566', 'confirmada'),                            -- Cita de HOY (Paciente nuevo)
(4, 3, CURDATE(), '12:00:00', '4497778899', 'pendiente');                             -- Cita de HOY (Pendiente de confirmar)

INSERT INTO consultations (
    id_consultation, id_patient, id_doctor, id_med_app, consultation_date, 
    diagnosis, blood_pressure, pulse, body_temperature, body_weight, body_height
) VALUES (
    1, 1, 1, 1, DATE_SUB(NOW(), INTERVAL 14 DAY),
    'Infección respiratoria aguda y trastorno de conciliación del sueño',
    '120/80', 74, 37.2, 78.50, 1.75
);

INSERT INTO prescriptions (id_prescription, id_consultation, id_origin_prescription, issue_date, is_controlled, medical_snapshot) VALUES
(
    1, 1, NULL, DATE_SUB(NOW(), INTERVAL 14 DAY), FALSE,
    JSON_OBJECT(
        'full_name', 'Dr. Alejandro Martínez Gómez',
        'address', 'Av. Universidad 1001, Fracc. Bosques del Prado, Aguascalientes, Ags.',
        'office', 'Torre Médica Consultorio 304',
        'office_phone', '4499123456',
        'whatsapp', '4491987654',
        'email', 'dr.martinez@clinicamedica.mx',
        'titles', JSON_ARRAY(
            JSON_OBJECT('title', 'Médico Cirujano', 'university', 'UAA', 'license', '8451236'),
            JSON_OBJECT('title', 'Especialidad en Medicina Interna', 'university', 'UNAM', 'license', '10948273')
        )
    )
),
(
    2, 1, 1, DATE_SUB(NOW(), INTERVAL 14 DAY), TRUE,
    JSON_OBJECT(
        'full_name', 'Dr. Alejandro Martínez Gómez',
        'address', 'Av. Universidad 1001, Fracc. Bosques del Prado, Aguascalientes, Ags.',
        'office', 'Torre Médica Consultorio 304',
        'office_phone', '4499123456',
        'whatsapp', '4491987654',
        'email', 'dr.martinez@clinicamedica.mx',
        'titles', JSON_ARRAY(
            JSON_OBJECT('title', 'Médico Cirujano', 'university', 'UAA', 'license', '8451236'),
            JSON_OBJECT('title', 'Especialidad en Medicina Interna', 'university', 'UNAM', 'license', '10948273')
        )
    )
);

-- En la Receta 1 (General) van Amoxicilina y Paracetamol
INSERT INTO prescription_details (id_detail, id_prescription, id_medication, dose, route_administration, dosing_frequency, duration) VALUES
(1, 1, 2, '1 cápsula de 500 mg', 'Oral', 'Cada 8 horas', '7 días'),
(2, 1, 1, '1 tableta de 500 mg', 'Oral', 'Cada 6 horas en caso de fiebre o dolor', '5 días'),
-- En la Receta 2 (Controlada) va únicamente Clonazepam (1 solo controlado por receta según RF-13)
(3, 2, 5, 'Media tableta (1 mg)', 'Oral', 'Cada 24 horas (30 minutos antes de dormir)', '14 días');

INSERT INTO clinical_audit_logs (id_user, med_action, affected_entity, id_affected_registry, details) VALUES
(1, 'EMISION_RECETA', 'prescriptions', 1, 'Emisión de receta general en consulta #1'),
(1, 'EMISION_RECETA', 'prescriptions', 2, 'Emisión de receta controlada ligada a receta general #1');