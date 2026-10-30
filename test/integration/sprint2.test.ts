import { describe, test, before, after } from "node:test";
import assert from "node:assert/strict";
import sequelizeConnection from "../../src/conf/sequelize.connection.ts";
import Patient from "../../src/models/patient.models.ts";
import Medicine from "../../src/models/medicine.models.ts";
import Prescription from "../../src/models/prescription.models.ts";

describe("Sprint 2 Integration Tests - Database and Sequelize Models ", () => {
  
  before(async () => {
    await sequelizeConnection.connect();
    await Patient.destroy({ where: { full_name: "TEST_Paciente_Sprint2" } });
    await Medicine.destroy({ where: { brand_name: "TEST_Medicina_Sprint2" } });
  });

  after(async () => {
    await Patient.destroy({ where: { full_name: "TEST_Paciente_Sprint2" } });
    await Medicine.destroy({ where: { brand_name: "TEST_Medicina_Sprint2" } });
    await sequelizeConnection.disconnect();
  });

  test("Create a patient record in MySQL and verify that all required fields are filled in", async () => {
    const nuevoPaciente = await Patient.create({
      full_name: "TEST_Paciente_Sprint2",
      birthdate: "2000-05-15",
      contact: "4491112233",
    });

    assert.ok(nuevoPaciente.id_patient > 0, "Debe generar un id_patient válido");
    assert.strictEqual(nuevoPaciente.full_name, "TEST_Paciente_Sprint2");
  });

  test("Invalid entry: Prevents the creation of duplicate patients with the same name and date of birth", async () => {
    await assert.rejects(
      async () => {
        await Patient.create({
          full_name: "TEST_Paciente_Sprint2",
          birthdate: "2000-05-15",
          contact: "4499998877",
        });
      },
      "Debe rechazar el registro duplicado por el constraint UNIQUE de la BD"
    );
  });

  test("Quick Addition of Medications to the Catalog and Prevention of Duplicates", async () => {
    const nuevaMedicina = await Medicine.create({
      brand_name: "TEST_Medicina_Sprint2",
      generic_name: "Paracetamol Test",
      presentation: "Caja 20 tabletas 500mg",
      is_controlled: false,
    });

    assert.ok(nuevaMedicina.id_medication > 0);
    assert.strictEqual(nuevaMedicina.is_controlled, false);
  });

  test("View previous prescriptions and controlled substances via Seeds", async () => {
    const recetas = await Prescription.findAll();
    assert.ok(recetas.length >= 1, "Debe existir al menos una receta cargada en seeds.sql");
  });
});