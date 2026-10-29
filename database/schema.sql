-- Sistema Web de Recetas Medicas - Esquema de Base de Datos
-- Responsable: Abisag Lucero Martínez Martínez
-- Cubre: Modelo ER. RF-01 a RF-24, RS-01, RS-06, RS-07

CREATE DATABASE IF NOT EXISTS system_prescriptions CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE system_prescriptions;

CREATE TABLE IF NOT EXISTS users (
    id_user INT AUTO_INCREMENT PRIMARY KEY, 
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('doctor', 'secretaria') NOT NULL,
    failed_attempts TINYINT UNSIGNED DEFAULT 0,
    locked_until DATETIME NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE= InnoDB;

CREATE TABLE IF NOT EXISTS doctors(
    id_doctor INT AUTO_INCREMENT PRIMARY KEY,
    id_user INT NOT NULL UNIQUE,
    full_name VARCHAR(150) NOT NULL,
    address VARCHAR(255) NOT NULL,
    office VARCHAR(100) NOT NULL,
    office_phone VARCHAR(20) NOT NULL,
    whatsapp VARCHAR(20) NOT NULL,
    email VARCHAR(100) NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, 
    CONSTRAINT fk_doctor_user FOREIGN KEY (id_user) REFERENCES users(id_user) ON DELETE RESTRICT
) ENGINE= InnoDB;

CREATE TABLE IF NOT EXISTS professional_titles(
    id_title INT AUTO_INCREMENT PRIMARY KEY,
    id_doctor INT NOT NULL, 
    title VARCHAR(150) NOT NULL,
    university VARCHAR(150) NOT NULL,
    professional_license VARCHAR(30) NOT NULL UNIQUE,
    CONSTRAINT fk_doctor_title FOREIGN KEY (id_doctor) REFERENCES doctors(id_doctor) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS patients (
    id_patient INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    birthdate DATE NOT NULL,
    contact VARCHAR(30) NOT NULL,
    opening_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_patient_name_date UNIQUE (full_name, birthdate),
    INDEX idx_patient_name (full_name)
)ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS medical_appointments(
    id_med_app INT AUTO_INCREMENT PRIMARY KEY,
    id_patient INT NOT NULL,
    date_app DATE NOT NULL,
    hour_app TIME NOT NULL,
    confirm_contact VARCHAR(30) NOT NULL,
    status_app ENUM ('pendiente', 'confirmada', 'cancelada') DEFAULT 'pendiente',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    CONSTRAINT fk_medical_appointment_patient FOREIGN KEY (id_patient) REFERENCES patients(id_patient) ON DELETE RESTRICT,
    -- ver agenda por dia
    INDEX idx_medical_appointment_date_hour (date_app, hour_app)
)ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS consultations(
    id_consultation INT AUTO_INCREMENT PRIMARY KEY,
    id_patient INT NOT NULL,
    id_doctor INT NOT NULL,
    id_med_app INT NULL UNIQUE,
    consultation_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    diagnosis TEXT NOT NULL,
    blood_pressure VARCHAR(20) NULL, 
    pulse SMALLINT UNSIGNED NULL,
    body_temperature DECIMAL (4,1) NULL,
    body_weight DECIMAL (5,2) NULL, 
    body_height  DECIMAL (4,2) NULL, 
    CONSTRAINT fk_consultation_patient FOREIGN KEY (id_patient) REFERENCES patients(id_patient) ON DELETE RESTRICT,
    CONSTRAINT fk_consultation_doctor FOREIGN KEY (id_doctor) REFERENCES doctors(id_doctor) ON DELETE RESTRICT,
    CONSTRAINT fk_consultation_med_app FOREIGN KEY (id_med_app) REFERENCES medical_appointments(id_med_app) ON DELETE SET NULL
)ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS medications(
    id_medication INT AUTO_INCREMENT PRIMARY KEY,
    brand_name VARCHAR(120) NOT NULL, 
    generic_name VARCHAR(120) NOT NULL, 
    presentation VARCHAR(100) NOT NULL, 
    is_controlled BOOLEAN NOT NULL DEFAULT FALSE, 
    CONSTRAINT uq_medication_brand_pres UNIQUE (brand_name, presentation),
    INDEX idx_brand_name (brand_name),
    INDEX idx_generic_name (generic_name)
)ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS prescriptions(
    id_prescription INT AUTO_INCREMENT PRIMARY KEY, 
    id_consultation INT NOT NULL, 
    id_origin_prescription INT NULL, 
    issue_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_controlled BOOLEAN NOT NULL DEFAULT FALSE,
    medical_snapshot JSON NOT NULL,
    CONSTRAINT fk_consultation_prescription FOREIGN KEY (id_consultation) REFERENCES consultations(id_consultation) ON DELETE RESTRICT,
    CONSTRAINT fk_origin_prescription FOREIGN KEY (id_origin_prescription) REFERENCES prescriptions(id_prescription) ON DELETE RESTRICT
)ENGINE= InnoDB;

CREATE TABLE IF NOT EXISTS prescription_details(
    id_detail INT AUTO_INCREMENT PRIMARY KEY,
    id_prescription INT NOT NULL,
    id_medication INT NOT NULL, 
    dose VARCHAR(100) NOT NULL, 
    route_administration ENUM ('Oral', 'Intramuscular', 'Intravenosa', 'Tópica', 'Sublingual', 'Oftálmica', 'Nasal', 'Rectal', 'Inhalatoria') NOT NULL, 
    dosing_frequency VARCHAR(100) NOT NULL,
    duration VARCHAR(100) NOT NULL,
    CONSTRAINT fk_prescription_detail FOREIGN KEY (id_prescription) REFERENCES prescriptions(id_prescription) ON DELETE CASCADE,
    CONSTRAINT fk_medication_detail FOREIGN KEY (id_medication) REFERENCES medications(id_medication) ON DELETE RESTRICT
)ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS clinical_audit_logs(
    id_event BIGINT AUTO_INCREMENT PRIMARY KEY, 
    id_user INT NOT NULL, 
    med_action ENUM ('CONSULTA_EXPEDIENTE', 'EMISION_RECETA', 'REIMPRESION_RECETA', 'EXPORTACION_DATOS') NOT NULL,
    affected_entity VARCHAR(50) NOT NULL,
    id_affected_registry INT NOT NULL,
    details VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_audit_logs FOREIGN KEY (id_user) REFERENCES users(id_user) ON DELETE RESTRICT
)ENGINE=InnoDB;