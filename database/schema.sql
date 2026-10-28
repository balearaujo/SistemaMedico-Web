-- Sistema Web de Recetas Medicas - Esquema de Base de Datos
-- Responsable: Abisag Lucero Martínez Martínez
-- Cubre: Modelo ER. RF-01 a RF-24, RS-01, RS-06, RS-07

CREATE DATABASE ID NOT EXIST system_recipes CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
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
    CONSTRAINT fk_doctor_degree FOREIGN KEY (id_doctor) REFERENCES doctors(id_doctor) ON DELETE CASCADE
) ENGINE=InnoDB;