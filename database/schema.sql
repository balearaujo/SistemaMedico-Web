-- Sistema Web de Recetas Medicas - Esquema de Base de Datos
-- Responsable: Abisag Lucero Martínez Martínez
-- Cubre: Modelo ER. RF-01 a RF-24, RS-01, RS-06, RS-07

CREATE DATABASE ID NOT EXISTS system_recipes CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE system_recipes;

CREATE TABLE IF NOT EXISTS users (
    id_user INT AUTO_INCREMENT PRIMARY KEY, 
    user VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    rol ENUM('doctor', 'secretaria') NOT NULL,
    failed_attempts TINYINT UNSIGNED DEFAULT 0.
    locked_until DATETIME NULL,
    created_in TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE= InnoDB;

CREATE TABLE IF NOT EXISTS doctors(
    id_doctor INT AUTO_INCREMENT PRIMARY KEY,
    id_user INT NOT NULL UNIQUE,
    full_name VARCHAR (150) NOT NULL.
    addr VARCHAR (255) NOT NULL,
    office VARCHAR(100) NOT NULL,
    office_phone VARCHAR(20) NOT NULL,
    whatsApp VARCHAR(20) NOT NULL,
    email VARCHAR(100) NOT NULL,
    update_in TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, 
    CONSTRAINT fk_doctor_user FOREIGN KEY (id_user) REFERENCES users(id_user) ON DELETE RESTRICT
) ENGINE= InnoDB;

CREATE TABLE IF NOT EXISTS professional_titles(
    id_title INT AUTO_INCREMENT PRIMARY KEY,
    id_doctor INT NOT NULL, 
    title VARCHAR(150) NOT NULL.
    university VARCHAR(150) NOT NULL,
    professional_license VARCHAR(30) NOT NULL UNIQUE,
    CONSTRAINT fk_doctor_title FOREIGN KEY (id_doctor) REFERENCES doctors(id_doctor) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS patients (
    id_patient INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    birthdate DATE NOT NULL,
    contact VARCHAR(30) NOT NULL,
    openingDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_patient_name_date UNIQUE (full_name, birthdate),
    INDEX idx_patient_name (full_name)
)ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS medicalAppointments(
    id_medApp INT AUTO_INCREMENT PRIMARY KEY,
    id_patient INT NOT NULL,
    dateApp DATE NOT NULL,
    hourApp TIME NOT NULL,
    confirmContact VARCHAR(30) NOT NULL,
    statusApp ENUM ('pendiente', 'confirmada', 'cancelada') DEFAULT 'pendiente',
    created_in TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    CONSTRAINT fk_medicalAppointment_patient FOREIGN KEY (id_patient) REFERENCES patients(id_patient) ON DELETE RESTRICT,
    --ver agenda por dia
    INDEX idx_medicalAppointment_dateApp_hourApp (dateApp, hourApp)
)ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS appointments(
    id_appointment INT AUTO_INCREMENT PRIMARY KEY,
    id_patient INT NOT NULL,
    id_doctor INT NOT NULL,
    id_medApp INT NOT NULL UNIQUE,
    dateApp DATETIME DEFAULT CURRENT_TIMESTAMP,
    diagnosis TEXT NOT NULL,
    blood_pressure VARCHAR(20) NULL, 
    pulse SMALLINT UNSIGNED NULL,
    body_temperature DECIMAL (4,1) NULL,
    body_weight DECIMAL (5,2) NULL, 
    body_height  DECIMAL (4,2) NULL, 
    CONSTRAINT fk_appointment_patient FOREIGN KEY (id_patient) REFERENCES patients(id_patient) ON DELETE RESTRICT,
    CONSTRAINT fk_appointment_doctor FOREIGN KEY (id_doctor) REFERENCES doctors(id_doctor) ON DELETE RESTRICT,
    CONSTRAINT fk_appointment_medApp FOREIGN KEY (id_medApp) REFERENCES medicalAppointments(id_medApp) ON DELETE SET NULL
)ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS medications(
    id_medication INT AUTO_INCREMENT PRIMARY KEY,
    brandName VARCHAR(120) NOT NULL, 
    genericName VARCHAR(120) NOT NULL, 
    presentation VARCHAR(100) NOT NULL, 
    is_Controlled BOOLEAN NOT NULL DEFAULT FALSE, 
    CONSTRAINT uq_medication_brandName_pres UNIQUE (brandName, presentation),
    INDEX idx_brandName (brandName),
    INDEX idx_genericName (genericName)
)ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS prescriptions(
    id_prescription INT AUTO_INCREMENT PRIMARY KEY, 
    id_appointment INT NOT NULL, 
    id_origin_prescription INT NOT NULL, 
    issue_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_Controlled BOOLEAN NOT NULL DEFAULT FALSE,
    medical_snapshot JSON NOT NULL,
    CONSTRAINT fk_appointment_prescription FOREIGN KEY (id_appointment) REFERENCES appointments(id_appointment) ON DELETE RESTRICT,
    CONSTRAINT fk_origin_prescription FOREIGN KEY (id_origin_prescription) REFERENCES prescriptions(id_prescription) ON DELETE RESTRICT
)ENGINE= InnoDB;

CREATE TABLE IF NOT EXISTS recipeDetails(
    id_detail INT AUTO_INCREMENT PRIMARY KEY,
    id_prescription INT NOT NULL,
    id_medication INT NOT NULL. 
    dose VARCHAR(100) NOT NULL, 
    route_administration ENUM ('Oral', 'Intramuscular', 'Intravenosa', 'Tópica', 'Sublingual', 'Oftálmica', 'Nasal', 'Rectal', 'Inhalatoria') NOT NULL, 
    frequency VARCHAR(100) NOT NULL,
    duration VARCHAR(100) NOT NULL,
    CONSTRAINT fk_recipeDetail FOREIGN KEY (id_prescription) REFERENCES prescriptions(id_prescription) ON DELETE CASCADE,
    CONSTRAINT fk_medicationDetail FOREIGN KEY (id_medication) REFERENCES medications(id_medication) ON DELETE RESTRICT
)ENGINE=InnoDB;